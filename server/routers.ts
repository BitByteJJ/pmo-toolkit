import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { db } from './_core/db';
import { users, sharedCollections, collectionCards, cardComments, collectionMembers } from '../drizzle/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// ─── Auth Router ──────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  logout: protectedProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie('session', { path: '/' });
    return { success: true };
  }),
});

// ─── Team Collections Router ──────────────────────────────────────────────────
const teamRouter = router({
  // List collections the user owns or is a member of
  listCollections: protectedProcedure.query(async ({ ctx }) => {
    const owned = await db.select().from(sharedCollections)
      .where(eq(sharedCollections.ownerId, ctx.user.id))
      .orderBy(desc(sharedCollections.updatedAt));

    const memberships = await db.select({ collectionId: collectionMembers.collectionId })
      .from(collectionMembers)
      .where(and(
        eq(collectionMembers.userId, ctx.user.id),
      ));

    const memberCollectionIds = memberships.map(m => m.collectionId);
    const memberCollections = memberCollectionIds.length > 0
      ? await db.select().from(sharedCollections)
          .where(inArray(sharedCollections.id, memberCollectionIds))
          .orderBy(desc(sharedCollections.updatedAt))
      : [];

    return { owned, shared: memberCollections };
  }),

  // Get a single collection with its cards
  getCollection: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [collection] = await db.select().from(sharedCollections)
        .where(eq(sharedCollections.id, input.id)).limit(1);

      if (!collection) return null;

      // Check access
      const isOwner = collection.ownerId === ctx.user.id;
      if (!isOwner && !collection.isPublic) {
        const [membership] = await db.select().from(collectionMembers)
          .where(and(
            eq(collectionMembers.collectionId, input.id),
            eq(collectionMembers.userId, ctx.user.id),
          )).limit(1);
        if (!membership) return null;
      }

      const cards = await db.select().from(collectionCards)
        .where(eq(collectionCards.collectionId, input.id))
        .orderBy(desc(collectionCards.addedAt));

      const [owner] = await db.select({ id: users.id, name: users.name, avatar: users.avatar })
        .from(users).where(eq(users.id, collection.ownerId)).limit(1);

      return { ...collection, cards, owner };
    }),

  // Get a public collection by share token (no auth required)
  getPublicCollection: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const [collection] = await db.select().from(sharedCollections)
        .where(and(
          eq(sharedCollections.shareToken, input.token),
          eq(sharedCollections.isPublic, true),
        )).limit(1);

      if (!collection) return null;

      const cards = await db.select().from(collectionCards)
        .where(eq(collectionCards.collectionId, collection.id))
        .orderBy(desc(collectionCards.addedAt));

      const [owner] = await db.select({ id: users.id, name: users.name, avatar: users.avatar })
        .from(users).where(eq(users.id, collection.ownerId)).limit(1);

      return { ...collection, cards, owner };
    }),

  // Create a new shared collection
  createCollection: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().max(1000).optional(),
      isPublic: z.boolean().default(false),
      cardIds: z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const shareToken = input.isPublic ? nanoid(32) : null;

      await db.insert(sharedCollections).values({
        ownerId: ctx.user.id,
        name: input.name,
        description: input.description,
        isPublic: input.isPublic,
        shareToken,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const [inserted] = await db.select().from(sharedCollections)
        .where(and(
          eq(sharedCollections.ownerId, ctx.user.id),
          eq(sharedCollections.name, input.name),
        ))
        .orderBy(desc(sharedCollections.createdAt))
        .limit(1);

      if (input.cardIds.length > 0 && inserted) {
        await db.insert(collectionCards).values(
          input.cardIds.map(cardId => ({
            collectionId: inserted.id,
            cardId,
            addedAt: Date.now(),
          }))
        );
      }

      return inserted;
    }),

  // Update a collection
  updateCollection: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().max(1000).optional(),
      isPublic: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [collection] = await db.select().from(sharedCollections)
        .where(and(
          eq(sharedCollections.id, input.id),
          eq(sharedCollections.ownerId, ctx.user.id),
        )).limit(1);

      if (!collection) throw new Error('Collection not found or not owned by you');

      const updates: Partial<typeof collection> = { updatedAt: Date.now() };
      if (input.name !== undefined) updates.name = input.name;
      if (input.description !== undefined) updates.description = input.description;
      if (input.isPublic !== undefined) {
        updates.isPublic = input.isPublic;
        if (input.isPublic && !collection.shareToken) {
          updates.shareToken = nanoid(32);
        }
      }

      await db.update(sharedCollections).set(updates)
        .where(eq(sharedCollections.id, input.id));

      return { success: true };
    }),

  // Delete a collection
  deleteCollection: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(sharedCollections).where(and(
        eq(sharedCollections.id, input.id),
        eq(sharedCollections.ownerId, ctx.user.id),
      ));
      return { success: true };
    }),

  // Add a card to a collection
  addCard: protectedProcedure
    .input(z.object({ collectionId: z.number(), cardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership or editor role
      const [collection] = await db.select().from(sharedCollections)
        .where(eq(sharedCollections.id, input.collectionId)).limit(1);

      if (!collection) throw new Error('Collection not found');
      if (collection.ownerId !== ctx.user.id) {
        const [membership] = await db.select().from(collectionMembers)
          .where(and(
            eq(collectionMembers.collectionId, input.collectionId),
            eq(collectionMembers.userId, ctx.user.id),
          )).limit(1);
        if (!membership || membership.role === 'viewer') throw new Error('Not authorised');
      }

      // Check if already in collection
      const existing = await db.select().from(collectionCards)
        .where(and(
          eq(collectionCards.collectionId, input.collectionId),
          eq(collectionCards.cardId, input.cardId),
        )).limit(1);

      if (existing.length === 0) {
        await db.insert(collectionCards).values({
          collectionId: input.collectionId,
          cardId: input.cardId,
          addedAt: Date.now(),
        });
      }

      return { success: true };
    }),

  // Remove a card from a collection
  removeCard: protectedProcedure
    .input(z.object({ collectionId: z.number(), cardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [collection] = await db.select().from(sharedCollections)
        .where(eq(sharedCollections.id, input.collectionId)).limit(1);

      if (!collection) throw new Error('Collection not found');
      if (collection.ownerId !== ctx.user.id) throw new Error('Not authorised');

      await db.delete(collectionCards).where(and(
        eq(collectionCards.collectionId, input.collectionId),
        eq(collectionCards.cardId, input.cardId),
      ));

      return { success: true };
    }),

  // Invite a user to a collection by email/name (simplified: by user ID)
  inviteMember: protectedProcedure
    .input(z.object({
      collectionId: z.number(),
      userId: z.number(),
      role: z.enum(['editor', 'viewer']).default('viewer'),
    }))
    .mutation(async ({ ctx, input }) => {
      const [collection] = await db.select().from(sharedCollections)
        .where(and(
          eq(sharedCollections.id, input.collectionId),
          eq(sharedCollections.ownerId, ctx.user.id),
        )).limit(1);

      if (!collection) throw new Error('Collection not found or not owned by you');

      const existing = await db.select().from(collectionMembers)
        .where(and(
          eq(collectionMembers.collectionId, input.collectionId),
          eq(collectionMembers.userId, input.userId),
        )).limit(1);

      if (existing.length === 0) {
        await db.insert(collectionMembers).values({
          collectionId: input.collectionId,
          userId: input.userId,
          role: input.role,
          joinedAt: Date.now(),
        });
      }

      return { success: true };
    }),
});

// ─── Comments Router ──────────────────────────────────────────────────────────
const commentsRouter = router({
  // Get comments for a card
  list: publicProcedure
    .input(z.object({ cardId: z.string() }))
    .query(async ({ input }) => {
      const comments = await db.select({
        id: cardComments.id,
        cardId: cardComments.cardId,
        content: cardComments.content,
        createdAt: cardComments.createdAt,
        updatedAt: cardComments.updatedAt,
        userId: cardComments.userId,
        userName: users.name,
        userAvatar: users.avatar,
      })
        .from(cardComments)
        .innerJoin(users, eq(cardComments.userId, users.id))
        .where(eq(cardComments.cardId, input.cardId))
        .orderBy(desc(cardComments.createdAt))
        .limit(50);

      return comments;
    }),

  // Post a comment
  post: protectedProcedure
    .input(z.object({
      cardId: z.string(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(cardComments).values({
        cardId: input.cardId,
        userId: ctx.user.id,
        content: input.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { success: true };
    }),

  // Delete a comment (own comment or admin)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [comment] = await db.select().from(cardComments)
        .where(eq(cardComments.id, input.id)).limit(1);

      if (!comment) throw new Error('Comment not found');
      if (comment.userId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new Error('Not authorised');
      }

      await db.delete(cardComments).where(eq(cardComments.id, input.id));
      return { success: true };
    }),

  // Edit a comment
  edit: protectedProcedure
    .input(z.object({ id: z.number(), content: z.string().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      const [comment] = await db.select().from(cardComments)
        .where(eq(cardComments.id, input.id)).limit(1);

      if (!comment) throw new Error('Comment not found');
      if (comment.userId !== ctx.user.id) throw new Error('Not authorised');

      await db.update(cardComments)
        .set({ content: input.content, updatedAt: Date.now() })
        .where(eq(cardComments.id, input.id));

      return { success: true };
    }),
});

// ─── Root Router ──────────────────────────────────────────────────────────────
export const appRouter = router({
  auth: authRouter,
  team: teamRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
