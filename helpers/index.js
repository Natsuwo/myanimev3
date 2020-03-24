
module.exports = {
    dayToNum(str) {
        str = str.toLowerCase()
        var day;
        switch (str) {
            case "sunday" || "sun":
                day = 0;
                break;
            case "monday" || "mon":
                day = 1;
                break;
            case "tuesday" || "tue":
                day = 2;
                break;
            case "wednesday" || "wed":
                day = 3;
                break;
            case "thursday" || "thu":
                day = 4;
                break;
            case "friday" || "fri":
                day = 5;
                break;
            case "saturday" || "sat":
                day = 6;
                break;
            default:
                day = null
                break;
        }
        return day
    },
    alphabet(items) {
        var listsAb = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z"
        ];
        var resultAb = {
            others: [],
            a: [],
            b: [],
            c: [],
            d: [],
            e: [],
            f: [],
            g: [],
            h: [],
            i: [],
            j: [],
            k: [],
            l: [],
            m: [],
            n: [],
            o: [],
            p: [],
            q: [],
            r: [],
            s: [],
            t: [],
            u: [],
            v: [],
            w: [],
            x: [],
            y: [],
            z: []
        };

        for (var item of items) {
            var count = 0;
            for (var character of listsAb) {
                if (item.title[0].toLowerCase().indexOf(character.toLowerCase()) > -1) {
                    resultAb[character.toLowerCase()].push(item);
                    count++;
                    continue;
                }
            }
            if (count === 0) {
                resultAb["others"].push(item);
            }
        }
        return {
            listsAb,
            resultAb
        };
    },
    escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    }
}