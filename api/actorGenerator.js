[
    {
      'repeat(100)': {
        _id: '{{objectId()}}',
        name: '{{firstName()}}',
        surname: '{{surname()}}',
        email(tags) {
          return `${this.name}${this.surname}@gmail.com`.toLowerCase();
        },
        password: '{{lorem(1, "words")}}',
        preferredLanguages: '{{random("es","en")}}',
        phone: '{{phone()}}',
        address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
        paypal(tags) {
          return `${this.name}${this.surname}@gmail.com`.toLowerCase();
        },
        role: [
         
            '{{random("MANAGER","EXPLORER","ADMINISTRATOR","SPONSOR")}}'
          
        ],
        validated: '{{bool()}}',
        banned: '{{bool()}}',
        customToken: '{{lorem(1, "words")}}',
        created: '{{moment(this.date(new Date(2019, 6, 1), new Date())).format()}}',
        finder: {
              keyword: '{{lorem(1, "words")}}',
              priceRangeMin: '{{integer(0,300)}}',
              priceRangeMax: '{{integer(300,1000)}}',
              dataRangeStart: '{{moment(this.date(new Date(2019, 6, 1), new Date(2019, 7, 15))).format()}}',
              dataRangeEnd: '{{moment(this.date(new Date(2019, 7, 15), new Date(2019, 9, 15))).format()}}'
          },
      }
    },
      {
      'repeat(100)': {
        _id: '{{objectId()}}',
        name: '{{firstName()}}',
        surname: '{{surname()}}',
        email(tags) {
          return `${this.name}${this.surname}@gmail.com`.toLowerCase();
        },
        password: '{{lorem(1, "words")}}',
        preferredLanguages: '{{random("es","en")}}',
        phone: '{{phone()}}',
        address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
        paypal(tags) {
          return `${this.name}${this.surname}@gmail.com`.toLowerCase();
        },
        role: [
          
            '{{random("MANAGER","EXPLORER","ADMINISTRATOR","SPONSOR")}}'
          
        ],
        validated: '{{bool()}}',
        banned: '{{bool()}}',
        customToken: '{{lorem(1, "words")}}',
        created: '{{moment(this.date(new Date(2019, 6, 1), new Date())).format()}}',
        finder: {
              keyword: '{{lorem(1, "words")}}',
              priceRangeMin: '{{integer(0,300)}}',
              priceRangeMax: '{{integer(300,1000)}}',
              dataRangeStart: '{{moment(this.date(new Date(2019, 6, 1), new Date(2019, 7, 15))).format()}}',
              dataRangeEnd: '{{moment(this.date(new Date(2019, 7, 15), new Date(2019, 9, 15))).format()}}'
          },
      }
    },
  ]