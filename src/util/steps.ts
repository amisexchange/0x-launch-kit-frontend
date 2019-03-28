import { OrderSide, Step, StepKind } from './types';

export const getStepTitle = (step: Step): string => {
    switch (step.kind) {
        case StepKind.BuySellLimit:
            return 'Sign';
        case StepKind.BuySellMarket:
            return step.side === OrderSide.Buy ? 'Buy' : 'Sell';
        case StepKind.ToggleTokenLock:
            return step.isUnlocked ? 'Lock' : 'Unlock';
        case StepKind.WrapEth:
            return 'Convert';
        default:
            const _exhaustiveCheck: never = step;
            return _exhaustiveCheck;
    }
};