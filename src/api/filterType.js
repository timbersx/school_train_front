const charFilter =
    [{
        value: '',
        label: '等于'
    }, {
        value: '__icontains',
        label: '包含'
    }, {
        value: '__isnull',
        label: '空值'
    }, {
        value: '__notnull',
        label: '非空值'
    }]

const intFilter =
    [{
        value: '',
        label: '等于'
    }, {
        value: '__icontains',
        label: '包含'
    }, {
        value: '__gt',
        label: '大于'
    }, {
        value: '__gte',
        label: '大于等于'
    }, {
        value: '__lt',
        label: '小于'
    }, {
        value: '__lte',
        label: '小等于'
    }, {
        value: '__isnull',
        label: '空值'
    }, {
        value: '__notnull',
        label: '非空值'
    }]

const dictFilter = [{
    value: '',
    label: '等于'
}, {
    value: '__isnull',
    label: '空值'
}, {
    value: '__notnull',
    label: '非空值'
}]

const dateFilter = [{
    value: '__gt',
    label: '大于'
}, {
    value: '__gte',
    label: '大于等于'
}, {
    value: '__lt',
    label: '小于'
}, {
    value: '__lte',
    label: '小等于'
}, {
    value: '__isnull',
    label: '空值'
}, {
    value: '__notnull',
    label: '非空值'
}, {
    value: '__range',
    label: '选择范围'
}]

export { charFilter, intFilter, dictFilter, dateFilter }