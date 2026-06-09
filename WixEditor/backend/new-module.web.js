import { Permissions, webMethod } from "wix-web-module";
import { orders } from "wix-pricing-plans.v2";
import { elevate } from "wix-auth";

const elevatedCreateOfflineOrder = elevate(orders.createOfflineOrder);

export const myCreateOfflineOrderFunction = webMethod(
    Permissions.Admin,
    async (planId, memberId) => {
        try {
            const newOrder = await elevatedCreateOfflineOrder(planId, memberId);

            return newOrder;
        } catch (error) {
            console.error(error);
            // Handle the error
        }
    },
);