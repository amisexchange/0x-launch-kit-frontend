import { assetDataUtils, OrderInfo } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { OrderBookItem, Token, UIOrder, UIOrderSide } from '../util/types';

export const ordersToUIOrders = (orders: SignedOrder[], ordersInfo: OrderInfo[], selectedToken: Token): UIOrder[] => {
    if (ordersInfo.length !== orders.length) {
        throw new Error(`AssertionError: Orders info length does not match orders length: ${ordersInfo.length} !== ${orders.length}`);
    }

    const selectedTokenEncoded = assetDataUtils.encodeERC20AssetData(selectedToken.address);

    return orders.map((order, i) => {
        const orderInfo = ordersInfo[i];

        const side = order.takerAssetData === selectedTokenEncoded ? UIOrderSide.Buy : UIOrderSide.Sell;
        const size = side === UIOrderSide.Sell ? order.makerAssetAmount : order.takerAssetAmount;
        const filled = side === UIOrderSide.Sell ? orderInfo.orderTakerAssetFilledAmount.div(order.takerAssetAmount).mul(order.makerAssetAmount) : orderInfo.orderTakerAssetFilledAmount;
        const price = side === UIOrderSide.Sell ? order.takerAssetAmount.div(order.makerAssetAmount) : order.makerAssetAmount.div(order.takerAssetAmount);
        const status = orderInfo.orderStatus;

        return {
            rawOrder: order,
            side,
            size,
            filled,
            price,
            status,
        };
    });
};

export const mergeByPrice = (orders: UIOrder[]): OrderBookItem[] => {
    const initialValue: { [x: string]: OrderBookItem[] } = {};

    const ordersByPrice = orders
        .reduce((acc, order) => {
            acc[order.price.toFixed(2)] = acc[order.price.toFixed(2)] || [];
            acc[order.price.toFixed(2)].push(order);
            return acc;
        }, initialValue);

    return Object.keys(ordersByPrice)
        .map(price => {
            return ordersByPrice[price].reduce((acc, order) => {
                return {
                    ...acc,
                    size: acc.size.add(order.size),
                };
            });
        });
};
