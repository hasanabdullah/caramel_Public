var mongoose = require("mongoose");
var DateOnly = require("mongoose-dateonly")(mongoose);

availabilitySchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: "betaDemoShop"
    },
    date: DateOnly,
    openTime: Number,
    closeTime: Number,
    slots: [Boolean]
});

module.exports = mongoose.model("Availability", availabilitySchema);


/*
availabilities: (defalt) from 6 am to 10 pm
a[0] = 6:00 - 6:30
a[1] = 6:30 - 7:00
a[2] = 7:00 - 7:30
a[3] = 7:30 - 8:00
a[4] = 8:00 - 8:30
a[5] = 8:30 - 9:00
a[6] = 9:00 - 9:30
a[7] = 9:30 - 10:00
a[8] = 10:00 - 10:30
a[9] = 10:30 - 11:00
a[10] = 11:00 - 11:30
a[11] = 11:30 - 12:00
a[12] = 12:00 - 12:30
a[13] = 12:30 - 13:00
a[14] = 13:00 - 13:30
a[15] = 13:30 - 14:00
a[16] = 14:00 - 14:30
a[17] = 14:30 - 15:00
a[18] = 15:00 - 15:30
a[19] = 15:30 - 16:00
a[20] = 16:00 - 16:30
a[21] = 16:30 - 17:00
a[22] = 17:00 - 17:30
a[23] = 17:30 - 18:00
a[24] = 18:00 - 18:30
a[25] = 18:30 - 19:00
a[26] = 19:00 - 19:30
a[27] = 19:30 - 20:00
a[28] = 20:00 - 20:30
a[29] = 20:30 - 21:00
a[30] = 21:00 - 21:30
a[31] = 21:30 - 22:00

 */