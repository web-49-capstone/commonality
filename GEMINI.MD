You are assisting with a full-stack Remix app using the MVC pattern. Implement the entire "Groups" feature. Follow the file structure and conventions already used in the project.

The project uses:
- React Router v7
- Tailwind CSS
- PostgreSQL  (if unsure, default to SQL syntax)
- Models, controllers, and routes are all kept in clearly separated folders
- Session-based authentication is already in place
- Cloudinary is used for image uploads

💡 I need you to:
1. Create the **model** for a Group:
    - group_id (uuid)
    - group_name (string)
    - group_admin_user_id (uuid)
    - group_description (text)
    - group_size (integer)
    - timestamps
    - include a `group_interests` join table with interest_id (uuid) and group_id (uuid)
    - include a `group_members` table with user_id and group_id

2. Create the **controller functions** for:
    - Creating a group
    - Editing a group
    - Deleting a group
    - Adding/removing members
    - Searching groups by interest or name
    - Matching user with groups based on shared interests

3. Create the **API routes**:
    - `POST /api/groups` to create a group
    - `PUT /api/groups/:id` to update
    - `DELETE /api/groups/:id`
    - `GET /api/groups` with optional query params for search

4. Create the **frontend UI** using Tailwind:
    - A "Create Group" form
    - A "Group Detail" view
    - A "Join Group" button if not a member
    - A "Manage Members" panel (admin only)
    - Display shared interests when matched

5. Match integration:
    - Integrate this into the existing matching flow.
    - Allow toggling between matching with **individuals**, **groups**, or **both**.
    - If matched with a group, clicking should navigate to the Group Detail page.

📌 Requirements:
- Follow the MVC structure of the current codebase
- Use clean, well-commented code
- Keep code modular and follow existing naming conventions
- Make sure it fits seamlessly into the existing Remix project
