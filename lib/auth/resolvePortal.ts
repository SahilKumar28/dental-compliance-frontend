

export type Portal = "admin" | "practice" | "learner";

export type Role = {
    role_id: number;
    role_name: string;
    practice_id: number;
    portal: string;
    color_theme: { primary: string, secondary: string }
};

export function resolvePortal(user: any): any {

    const { roles, defaultRole } = user

    // const portals = roles.map((role) => role.portal)

    // if(portals.includes("admin")) return "admin"
    // if(portals.includes("practice")) return "practice"

    // return "learner";

    let portal = ''
    let active_role_name = ''
    let active_practice_id = -1
    let active_role_id = -1
    let active_color_theme = {}

    roles.map((role: any) => {
        if (role.portal === 'admin') {
            portal = 'admin'
            active_role_name = role.role_name
            active_practice_id = role.practice_id
            active_role_id = role.role_id
            active_color_theme = role.color_theme
        }

        if (portal !== 'admin' && role.portal === 'learner') {
            portal = 'learner'
            active_role_name = role.role_name
            active_practice_id = role.practice_id
            active_role_id = role.role_id
            active_color_theme = role.color_theme
        }

        if (portal !== 'admin' && role.portal === 'practice') {
            portal = 'practice'
            active_role_name = role.role_name
            active_practice_id = role.practice_id
            active_role_id = role.role_id
            active_color_theme = role.color_theme
        }

    })
    return { portal, active_role_name, active_practice_id, active_role_id, active_color_theme }
}

