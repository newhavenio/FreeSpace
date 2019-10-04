# VPC_overlap

VPC_overlap is a tool for checking VPC network assignments across an
AWS Organization for overlaps which could create obstacles to peering.

## Supported functions

All choices support a "--profile" option to use the profile for the master account.
Only profiles for the master account in an AWS Organization are supported.

Output format is CSV

###compute-overlaps

Compute and display VPC network overlaps.

Returns a 

###fetch-accounts

Retrieve list of accounts in AWS Organizations.

###fetch-regions

Retrieve list of regions from EC2 service.

###fetch-vpcs

Retrieve VPCs for accounts.
