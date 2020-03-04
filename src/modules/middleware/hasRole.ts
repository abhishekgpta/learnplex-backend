import {MiddlewareFn} from "type-graphql";

import {MyContext} from "../../types/MyContext";
import {UserRole} from "../../entity/user/UserRole.enum";
import {User} from "../../entity/User.entity";

export const hasRole: (roles: UserRole[]) => MiddlewareFn<MyContext> = (roles: UserRole[]) => async ({ context }, next) => {
    let user: User;
    try {
        [user] = await User.find({ where: { id: context.payload!.userId }, take: 1 });
    } catch (e) {
        console.error(e);
        throw new Error('not authenticated')
    }

    const containsRole = roles.filter((role) => user.roles.indexOf(role) !== -1).length !== 0;
    if (!containsRole) {
        throw new Error('not authorized');
    }

    return next();
};
