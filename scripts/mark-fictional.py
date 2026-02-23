#!/usr/bin/env python3
"""Mark fictional case studies with fictional: true in caseStudiesData.ts"""

FICTIONAL_ORGS = [
    'TechSolutions Inc.',
    'Manufacturing Excellence Corp.',
    'MediCorp Pharmaceuticals',
    'Aurora Motors',
    'Precision Manufacturing Ltd.',
    'Global Logistics Inc.',
    'Urban Development Corp.',
    'FinTech Innovations Ltd.',
]

with open('client/src/lib/caseStudiesData.ts', 'r') as f:
    lines = f.readlines()

result_lines = []
count = 0
i = 0

while i < len(lines):
    line = lines[i]
    result_lines.append(line)

    # Check if this line contains a fictional org
    is_fictional_org = any(
        f'organisation: `{org}`' in line or f"organisation: '{org}'" in line
        for org in FICTIONAL_ORGS
    )

    if is_fictional_org:
        # Scan forward to find the closing '  },' of this object (depth tracking)
        j = i + 1
        depth = 0
        while j < len(lines):
            next_line = lines[j]
            depth += next_line.count('{') - next_line.count('}')
            if depth < 0:
                # Insert fictional: true before the closing brace line
                result_lines.append('    fictional: true,\n')
                count += 1
                break
            j += 1

    i += 1

with open('client/src/lib/caseStudiesData.ts', 'w') as f:
    f.writelines(result_lines)

print(f'Added fictional: true to {count} case studies')
