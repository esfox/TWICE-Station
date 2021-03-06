const prefix = require('config/config').prefixes[0];
const albumCount = Object.values(require('data/music.json').albums).length;

module.exports = 
[
  {
    name: "Sweet",
    code: "col-swt",
    items:
    [
      "ny-c", "ny-j", "dh-c", "dh-j", "sn-c", "sn-j", 
      "mn-c", "mn-j", "jy-c", "jy-j", "tz-c", "tz-j", 
      "ch-c", "ch-j", "mm-c", "mm-j", "jh-c", "jh-j"
    ],
    description: 'All 18 candies and jellies of all members.',
    bonus: 500
  },
  {
    name: "Plushie",
    code: "col-pl",
    items:
    [
      "ny-p", "dh-p", "sn-p", 
      "mn-p", "jy-p", "tz-p", 
      "ch-p", "mm-p", "jh-p"
    ],
    description: 'All 9 plushies, 1 per member.',
    bonus: 3000
  },
  {
    name: "Lovelys",
    code: "col-lvl",
    items:
    [
      "ny-lv", "dh-lv", "sn-lv", 
      "mn-lv", "jy-lv", "tz-lv", 
      "ch-lv", "mm-lv", "jh-lv"
    ],
    description: 'All 9 lovelys, 1 per member.',
    bonus: 5000
  },
  {
    name: "Album",
    code: "col-alb",
    items:
    [
      "tsb-a", "pgt-a", "tc1-a", "tc2-a", "sgl-a", "twt-a", 
      "mnh-a", "wil-a", "smn-a", "bdz-a", "bdr-a", "yoy-a", 
      "tyy-a", "fcy-a", "htt-a", "cdp-a", "omt-a", "wmu-a",
      "ht2-a", "bth-a", "hph-a", "fsp-a"
    ],
    description: `All the ${albumCount} albums and EPs.`
      + ` (Do \`${prefix}albums\` to see all albums and EPs.)`,
    bonus: 7000
  },
  {
    name: "TWICE",
    code: "col-tw",
    items:
    [
      "ny-pc", "ny-ps", "dh-pc", "dh-ps", "sn-pc", "sn-ps", 
      "mn-pc", "mn-ps", "jy-pc", "jy-ps", "tz-pc", "tz-ps", 
      "ch-pc", "ch-ps", "mm-pc", "mm-ps", "jh-pc", "jh-ps"
    ],
    description: 'All photocards and posters of each member.',
    bonus: 9000
  },
  {
    name: "Nayeon",
    code: "col-ny",
    items: [ "ny-p", "ny-pc", "ny-ps", "mc" ],
    description: 'The plushie, photocard, poster and rare item of a member.'
      + ' (9 collections, 1 per member)',
    bonus: 4000
  },
  {
    name: "Dahyun",
    code: "col-dh",
    items: [ "dh-p", "dh-pc", "dh-ps", "cm" ],
    bonus: 4000
  },
  {
    name: "Sana",
    code: "col-sn",
    items: [ "sn-p", "sn-pc", "sn-ps", "ck" ],
    bonus: 4000
  },
  {
    name: "Mina",
    code: "col-mn",
    items: [ "mn-p", "mn-pc", "mn-ps", "sw" ],
    bonus: 4000
  },
  {
    name: "Jeongyeon",
    code: "col-jy",
    items: [ "jy-p", "jy-pc", "jy-ps", "sx" ],
    bonus: 4000
  },
  {
    name: "Tzuyu",
    code: "col-tz",
    items: [ "tz-p", "tz-pc", "tz-ps", "bw" ],
    bonus: 4000
  },
  {
    name: "Chaeyoung",
    code: "col-ch",
    items: [ "ch-p", "ch-pc", "ch-ps", "sb" ],
    bonus: 4000
  },
  {
    name: "Momo",
    code: "col-mm",
    items: [ "mm-p", "mm-pc", "mm-ps", "jk" ],
    bonus: 4000
  },
  {
    name: "Jihyo",
    code: "col-jh",
    items: [ "jh-p", "jh-pc", "jh-ps", "th" ],
    bonus: 4000
  },
  {
    name: "Nayeon Special",
    code: "col-nys",
    items: [ "ny-pc", "mc", "kng" ],
    description: 'The photocard, rare item and legendary item of a member.'
      + ' (9 collections, 1 per member)',
    bonus: 7000
  },
  {
    name: "Momo Special",
    code: "col-mms",
    items: [ "mm-pc", "jk", "mmc" ],
    bonus: 7000
  },
  {
    name: "Chaeyoung Special",
    code: "col-chs",
    items: [ "ch-pc", "sb", "chd" ],
    bonus: 7000
  },
  {
    name: "Jihyo Special",
    code: "col-jhs",
    items: [ "jh-pc", "th", "jhp" ],
    bonus: 7000
  },
  {
    name: "Jeongyeon Special",
    code: "col-jys",
    items: [ "jy-pc", "sx", "jyl" ],
    bonus: 7000
  },
  {
    name: "Dahyun Special",
    code: "col-dhs",
    items: [ "dh-pc", "cm", "dbc" ],
    bonus: 7000
  },
  {
    name: "Tzuyu Special",
    code: "col-tzs",
    items: [ "tz-pc", "bw", "gci" ],
    bonus: 7000
  },
  {
    name: "Sana Special",
    code: "col-sns",
    items: [ "sn-pc", "ck", "sgt" ],
    bonus: 7000
  },
  {
    name: "Mina Special",
    code: "col-mns",
    items: [ "mn-pc", "sw", "mnl" ],
    bonus: 7000
  },
  {
    name: "Cheer Up",
    code: "col-chr",
    items: [ "pgt-a", "chj" ],
    description: 'Page Two Album and Cheer Up Jacket.',
    bonus: 5000
  },
  {
    name: "Yes or Yes",
    code: "col-yoy",
    items: [ "yoy-a", "yoy" ],
    description: 'Yes or Yes Album and Yes or Yes Dice.',
    bonus: 5000
  },
  {
    name: "Likey",
    code: "col-lky",
    items: [ "twt-a", "lkc" ],
    description: 'Twicetagram Album and Likey Video Camera.',
    bonus: 5000
  },
  {
    name: "JYP",
    code: "col-jyp",
    items: [ "jkb", "ptp", "sgl-a", "wil-a" ],
    description: 'What Is Love? Album, Signal Album,'
      + ' JYP Plastic Pants and JYP\'s MIDI Keyboard.',
    bonus: 15000
  }
]
