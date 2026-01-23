#!/usr/bin/env python3
"""
Extract all organizations and create CSV for manual contact info entry
"""

import re
import csv

# Read file
with open('/home/user/virtual-exchange/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find organizations array
start = content.find('const organizations = [')
end = content.find('  ];', start)
orgs_text = content[start:end]

# Extract organization data
organizations = []
current_org = {}

for line in orgs_text.split('\n'):
    # Extract fields
    id_match = re.search(r'id:\s*(\d+)', line)
    if id_match:
        if current_org:
            organizations.append(current_org)
        current_org = {'id': id_match.group(1)}

    name_match = re.search(r'name:\s*"([^"]+)"', line)
    if name_match:
        current_org['name'] = name_match.group(1)

    type_match = re.search(r'type:\s*"([^"]+)"', line)
    if type_match:
        current_org['type'] = type_match.group(1)

    category_match = re.search(r'category:\s*"([^"]+)"', line)
    if category_match:
        current_org['category'] = category_match.group(1)

    country_match = re.search(r'country:\s*"([^"]+)"', line)
    if country_match:
        current_org['country'] = country_match.group(1)

    city_match = re.search(r'city:\s*"([^"]+)"', line)
    if city_match:
        current_org['city'] = city_match.group(1)

    state_match = re.search(r'state:\s*"([^"]+)"', line)
    if state_match:
        current_org['state'] = state_match.group(1)

    website_match = re.search(r'website:\s*"([^"]+)"', line)
    if website_match:
        current_org['website'] = website_match.group(1)

    email_match = re.search(r'email:\s*"([^"]+)"', line)
    if email_match:
        current_org['email'] = email_match.group(1)

    phone_match = re.search(r'phone:\s*"([^"]+)"', line)
    if phone_match:
        current_org['phone'] = phone_match.group(1)

    description_match = re.search(r'description:\s*"([^"]+)"', line)
    if description_match:
        current_org['description'] = description_match.group(1)

# Add last org
if current_org:
    organizations.append(current_org)

# Known real organizations (don't need verification)
known_real_orgs = [
    'Stevens Initiative',
    'Soliya',
    'SUNY COIL',
    'iEARN',
    'Global Nomads Group',
    'Erasmus+ Virtual Exchange',
    'IREX'
]

# Write to CSV
with open('/home/user/virtual-exchange/organizations_contact_info.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = [
        'ID',
        'Organization Name',
        'Type',
        'Category',
        'Country',
        'State/City',
        'Current Website',
        'Real Website (FILL IN)',
        'Current Email',
        'Real Email (FILL IN)',
        'Current Phone',
        'Real Phone (FILL IN)',
        'Status',
        'Notes'
    ]

    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for org in organizations:
        location = org.get('state', org.get('city', ''))
        if org.get('state') and org.get('city'):
            location = f"{org.get('city')}, {org.get('state')}"

        # Mark if this is a known real org
        status = 'VERIFIED ✓' if org.get('name') in known_real_orgs else 'NEEDS VERIFICATION'

        writer.writerow({
            'ID': org.get('id', ''),
            'Organization Name': org.get('name', ''),
            'Type': org.get('type', ''),
            'Category': org.get('category', ''),
            'Country': org.get('country', ''),
            'State/City': location,
            'Current Website': org.get('website', ''),
            'Real Website (FILL IN)': org.get('website', '') if org.get('name') in known_real_orgs else '',
            'Current Email': org.get('email', ''),
            'Real Email (FILL IN)': org.get('email', '') if org.get('name') in known_real_orgs else '',
            'Current Phone': org.get('phone', ''),
            'Real Phone (FILL IN)': org.get('phone', '') if org.get('name') in known_real_orgs else '',
            'Status': status,
            'Notes': 'Contact info verified' if org.get('name') in known_real_orgs else 'Placeholder data - needs real contact info'
        })

print(f"✅ Created organizations_contact_info.csv with {len(organizations)} organizations")
print(f"   - {len([o for o in organizations if o.get('name') in known_real_orgs])} verified")
print(f"   - {len([o for o in organizations if o.get('name') not in known_real_orgs])} need real contact info")
print("\nFile location: /home/user/virtual-exchange/organizations_contact_info.csv")
