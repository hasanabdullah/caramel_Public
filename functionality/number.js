module.exports = {
    getNumber: function (num) {
        return (num / 100).toFixed(2);
    },
    setNumber: function (num) {
        return num * 100;
    }
};