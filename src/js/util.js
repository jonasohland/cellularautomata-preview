export function _bv(bit)
{
    return 1 << bit;
}

export function setbits(value, ...bits)
{
    bits.forEach(bit => {
        value = value |= _bv(bit);
    });
    return value;
}

export function clearbit(value, ...bits)
{
    bits.forEach(bit => {
        value = value &= ~(_bv(bit));
    });
    return value; 
}

export function getbit(value, bit) 
{
    return (value & _bv(bit)) > 0;
}

console.log(setbits(0, 0, 3));