Permissions Guide by Organisation Type and User Role
This document provides a detailed explanation of permissions based on Organisation Type and User Type, as derived from the two provided tables. It consolidates the matrix into a clear, human-readable guide suitable for onboarding, documentation, or system reference.


1.	Permission Levels (Numeric Codes)
These numeric values appear throughout the permissions table and represent capability levels:

•	4 – Add, Edit & View (full control)
•	3 – Add only
•	2 – Edit & View
•	1 – View only (read‑only)


2.	Functional Areas
The permissions are defined across several modules:

2.1	Growth Models
Access to growth model library, editing or allocating farm-specific models.

2.2	Feed Library / Feed Supply
Management of feed documentation, suppliers, and supply chain actions.

2.3	Organisations
Permissions related to Feed Manufacturers, Fish Producers, and Fish Suppliers.

2.4	Users
User creation, editing, deletion, and permission management.

2.5	Farm Setup
Farm configuration: ponds, locations, layouts, batch allocations.

2.6	Fish Supply / Batches
Actions related to fish supply chain: batch creation, editing, viewing, and downstream actions.
 
3.	Organisation Types and User Roles
Below is the role-by-role breakdown with detailed capabilities.


3.1	Feed Flow Help Desk
User Types:
•	Business Manager
•	Feedflow Administrator (Admin)
•	Advisor: Technical Services – advisor to clients

Permissions

Growth Models

•	Business Manager: 4 (add, edit, view; plus allocating models)
•	Admin: 1 (view only)
•	Advisor: No direct model editing rights
Feed Library / Master Feed Docs

•	Business Manager: 4
•	Admin: 1 
Organisation Management
•	Business Manager: 3, 3 for manufacturers & producers
•	Admin: 3, 3
•	Advisor: 2,1 (limited—can only edit/view assigned)
User Management

•	Business Manager: Full management for all organisation types
•	Admin: Full internal management
•	Advisor: Restricted to view (2,1) Farm Setup
•	Business Manager: Full creation, editing, deletion (4,2,1)
•	Admin: Same as Business Manager
•	Advisor: View only Feed Supply
•	Business Manager: 4,2,1 (full)
•	Admin: 4,2,1
•	Advisor: View only

 
3.2	Feed Manufacturer
User Types:
•	Business Manager
•	Feedflow Administrator
•	Advisor: Technical Services
Permissions

Growth Models

•	Admin: 1
•	Others: No direct permissions
Feed Library

•	Business Manager: 4
•	Admin: 4 Organisation Management
•	Manufacturer Org: Business Manager & Admin: 2 (edit/view own organisation)
•	Advisors: 2,1 (restricted)
Users

•	Internal user management: Business Manager = 4, Admin = 4 Setup / Feed Supply
•	Business Manager: 4
•	Admin: 4
•	Advisor: View only


3.3	Fish Producer
User Types:
•	Business Manager
•	Feedflow Administrator
•	Operational Manager
•	Farm Manager
•	General Worker (Level 2)
•	General Worker (Level 1)
 
Growth Models

•	Business Manager: No explicit access in table
•	Admin: No explicit access
•	Lower roles: None


Feed Library

•	Business Manager: 3
•	Admin: 3


Organisation Management

•	Business Manager: Fish producers = 3, manufacturers = 2
•	Admin: Fish producers = 3, manufacturers = 2
•	Operational Manager: 1 (view only)
•	Farm Manager: 1
•	General Workers L2 & L1: 1 each


User Management

•	Business Manager: 4
•	Admin: 4
•	Operational Manager: 4 (for fish producing users only)
•	Farm Manager: 1 (view only)
•	Workers: 1 (view only)


Fish Supply / Batches

•	Business Manager: 4
•	Admin: 4
•	Operational Manager: 4
•	Farm Manager: 1
•	Workers: 1


Farm Setup

•	Business Manager: 4
•	Admin: 4
•	Operational Manager: 4
•	Farm Manager: 1
•	Workers: 1
 
Feed Supply

•	Same pattern as above: BM/Admin = Full, others = View


3.4	Third‑Party Advisors (External)
User Types:
•	Business Manager
•	Feedflow Administrator
•	Advisor: Technical services
Permissions
•	Growth models: No access
•	Feed library: View only
•	Organisation management: View only of assigned producers
•	Users: View only
•	Fish supply: View only
•	Farm setup: View only
•	Feed supply: View only
These roles are strictly non-editing observational roles.


3.5	Fish Supplier
User Types:
•	Business Manager
•	Feedflow Administrator
•	Advisor: Technical services
Permissions

Growth Models

•	Business Manager: None
•	Admin: None
Organisation Management

•	Can view assigned feed supplier organisations only
•	Admin & Business Manager: 1 Users
•	Business Manager: 1
•	Admin: 1
 
•	Advisor: 1

Fish Supply / Batch Management

•	Same as Organisations: View only Feed Supply
•	View only


4.	Summary Table (Human-Readable)
This list simplifies the complex matrix:

•	Help Desk → Highest access across all farms and organisations.
•	Feed Manufacturer → Full control over feed-related modules, limited control elsewhere.
•	Fish Producer → Full control over all farm operations; access reduces down the hierarchy.
•	External Advisors → View-only across all modules.
•	Fish Suppliers → View-only limited to supplier-related data.


If you'd like, I can also generate: - A colour-coded permission matrix - A PDF version of this guide - A collapsible documentation format for Confluence or Notion - A JSON or YAML permissions schema for system implementation
