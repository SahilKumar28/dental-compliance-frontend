

export type Portal = "admin" | "practice" | "learner";

export type Role = {
    role_id: number;
    role_name: string;
    practice_id: number;
    portal: string
};

export function resolvePortal(roles: Role[]): any {

    // const portals = roles.map((role) => role.portal)

    // if(portals.includes("admin")) return "admin"
    // if(portals.includes("practice")) return "practice"

    // return "learner";

    let portal = ''
    let active_role_name = ''
    let active_practice_id = -1

    roles.map((role) => {
        if (role.portal === 'admin') {
            portal = 'admin'
            active_role_name = role.role_name
            active_practice_id = role.practice_id
        }

        if (portal !== 'admin' && role.portal === 'learner') {
            portal = 'learner'
            active_role_name = role.role_name
            active_practice_id = role.practice_id
        }

        if (portal !== 'admin' && role.portal === 'practice') {
            portal = 'practice'
            active_role_name = role.role_name
            active_practice_id = role.practice_id
        }

    })

    return { portal, active_role_name, active_practice_id }
}

