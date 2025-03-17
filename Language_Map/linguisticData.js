const linguisticData = [
  {
    "name": "root",
    "type": "root",
    "collapsed": false,
    "children": [
      {
        "name": "Past",
        "type": "node",
        "collapsed": false,
        "details": {
          "field1": "Indicates actions, events, or states that happened before the present moment. "
        },
        "examples": [
          {
            "language": "English",
            "description": "One day the princess decided that she did not like staying at home all day, so she told her mother that she wanted to get a job."
          },
          {
            "language": "Telugu",
            "description": "ఒకరోజు రోజంతా ఇంట్లో ఉండటం ఇష్టం లేదని యువరాణి నిర్ణయించుకోగా, ఉద్యోగం రావాలని తల్లికి చెప్పింది."
          },
          {
            "language": "Gujarati",
            "description": "એક દિવસ રાજાએ નક્કી કર્યું કે, તેમને આખો દિવસ ઘોડેસવારી કરવી ગમતી ન હતી, તેથી તેમણે મહામંત્રીને કહ્યું કે, તેમને હાથીની સવારી કરવાની ઈચ્છા હતી."
          }
        ],
        "children": [
          {
            "name": "Habitual Actions",
            "type": "node",
            "collapsed": false,
            "details": {
              "field1": "Used for repeated past actions."
            },
            "examples": [
              // {
              //   "language": "English",
              //   "description": "He always walked to school."
              // },
              // {
              //   "language": "English",
              //   "description": "I used to eat daily."
              // },
              // {
              //   "language": "English",
              //   "description": "He used to read a book everyday."
              // },
              {
                "language": "Telugu",
                "description": "అతను ఎల్లప్పుడూ పాఠశాలకు నడిచేవాడు."
              },
              {
                "language": "Telugu",
                "description": "నేను ప్రతిరోజూ భోజనం చేసేవాడిని."
              },
              {
                "language": "Telugu",
                "description": "అతను ప్రతిరోజూ పుస్తకాలు చదివేవాడు."
              },
              {
                "language": "Gujarati",
                "description": "તે હંમેશાં ધ્યાન કરીને જ દિવસની શરૂઆત કરતો હતો."
              },
              {
                "language": "Gujarati",
                "description": "હું શાળાએ સમયસર જતો હતો."
              },
              {
                "language": "Gujarati",
                "description": "તે નાનો હતો ત્યારે દરરોજ વાર્તાના પુસ્તકો વાંચતો હતો."
              }
            ]
          },
          {
            "name": "Reported Speech",
            "type": "node",
            "collapsed": false,
            "details": {
              "field1": "Back-shifting (Past -> Past Perfect)"
            },
            "examples": [
              {
                "language": "English",
                "description": "He said that he had eaten a mango."
              },
              {
                "language": "Telugu",
                "description": "ఆమె భోజనం చేసిందని చెప్పింది."
              },
              {
                "language": "Gujarati",
                "description": "તેણે કહ્યું કે, તે ત્યાં ફરવા ગયો હતો."
              }
            ]
          }
        ]
      },
      {
        "name": "Present",
        "type": "node",
        "collapsed": false,
        "details": {
          "field1": "Indicates actions, events, or states that are happening at the current moment."
        },
        "examples": [
          // {
          //   "language": "English",
          //   "description": "The girl plays tennis now."
          // },
          {
            "language": "Gujarati",
            "description": "તેણીની અત્યારે સફરજન ખાઈ રહી છે."
          },
          {
            "language": "Telugu",
            "description": "తેણીની అત આજે સફરજન ખાઈ રહી છે."
          }
        ],
        "children": [
          {
            "name": "Universal Facts",
            "type": "node",
            "collapsed": false,
            "examples": [
              {
                "language": "English",
                "description": "The sun rises in the east."
              },
              {
                "language": "Telugu",
                "description": "సూర్యుడు తూర్పున ఉదయిస్తాడు."
              },
              {
                "language": "Gujarati",
                "description": "સૂર્ય પૂર્વમાં ઊગે છે."
              }
            ]
          },
          {
            "name": "Habitual Actions",
            "type": "node",
            "collapsed": false,
            "examples": [
              {
                "language": "English",
                "description": "I drink coffee every day."
              }
            ]
          },
          {
            "name": "Future (Scheduled Events)",
            "type": "node",
            "collapsed": false,
            "examples": [
              {
                "language": "English",
                "description": "The train departs from Delhi at 6:30 AM tomorrow."
              }
            ]
          }
        ]
      },
      {
        "name": "Future",
        "type": "node",
        "collapsed": false
      }
    ]
  }
];
