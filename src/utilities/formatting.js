import accounting from 'accounting';

export function formatMoney (amount) {
    return accounting.formatMoney(amount, {
        precision: 2,
    });
}

export function formatPercentage(amount) {
    return accounting.formatNumber(amount, 2) + '%';
}
