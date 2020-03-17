<template>
  <div class="home">
    <p>
    Found Rivens:
    </p>
    <b-table small class="w-100" :fields="this.fields" :items="this.data | sellOrders">
      <template v-slot:cell(age)="{ item }">
        {{ item.updated | moment("from", true) }}
      </template>
      <template v-slot:cell(name)="{ item }">
        {{ item.item.weapon_url_name | translateUrlName }} {{ item.item.name }}
      </template>
      <template v-slot:cell(price)="{ item }">
        {{ item.starting_price }}
      </template>
      <template v-slot:cell(rolls)="{ item }">
        {{ item.item.re_rolls }}
      </template>
      <template v-slot:cell(polarity)="{ item }">
        {{ item.item.polarity }}
      </template>
      <template v-slot:cell(stats)="{ item }">
        <b-col>
          <div :key="stat.url_name" v-for="stat in positiveStats(item.item.attributes)">
            {{stat.url_name | translateUrlName }}: {{stat.value}}
          </div>
        </b-col>
        <b-col>
          <div :key="stat.url_name" v-for="stat in negativeStats(item.item.attributes)">
            {{stat.url_name | translateUrlName }}: {{stat.value}}
          </div>
        </b-col>
      </template>
      <template v-slot:cell(auctionLink)="{ item }">
        <a :href="'https://warframe.market/auction/' + item.id">Link</a>
      </template>
    </b-table>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Auction as AuctionType } from '@/types/index.ts'
import Component from 'vue-class-component'
import { BTable, BCol } from 'bootstrap-vue'
import UrlNameDict from '@/types/url_names.ts'

@Component({
  components: {
    BTable,
    BCol
  },
  filters: {
    notClosed: function (auctions: AuctionType[]) {
      return auctions.filter(a => !a.closed)
    },
    sellOrders: function (auctions: AuctionType[]) {
      return auctions.filter(a => a.is_direct_sell)
    },
    translateUrlName: function (urlName: string) {
      const result = UrlNameDict[urlName]
      if (!result) throw new Error('Invalid url_name: ' + urlName)
      return result
    }
  }
})
export default class AuctionList extends Vue {
  data: AuctionType[] = []
  fields = [
    'age',
    'name',
    'price',
    'rolls',
    'polarity',
    'stats',
    'auctionLink'
  ]

  positiveStats (stats: { positive: boolean }[]) {
    return stats.filter(s => s.positive)
  }

  negativeStats (stats: { positive: boolean }[]) {
    return stats.filter(s => !s.positive)
  }

  mounted () {
    console.log('Loading rivens')
    if (process.env.NODE_ENV === 'production') {
      this.$jsonp('https://jsonp.afeld.me', {
        url: 'https://api.warframe.market/v1/profile/Qwyll/auctions'
      }).then((json: { payload: { auctions: AuctionType[] }}) => {
        this.data = json.payload.auctions.map((a: AuctionType) => {
          a.updated = new Date(a.updated)
          return a
        })
      }).catch(e => {
        console.log(e)
      })
    } else {
      this.data = JSON.parse('[{"buyout_price":250,"private":false,"note":"","item":{"re_rolls":8,"polarity":"naramon","name":"crita-visiada","weapon_url_name":"arca_plasmor","attributes":[{"value":82.6,"positive":true,"url_name":"base_damage_/_melee_damage"},{"value":45.2,"positive":true,"url_name":"critical_chance"},{"value":22.2,"positive":true,"url_name":"damage_vs_infested"},{"value":-20,"positive":false,"url_name":"magazine_capacity"}],"type":"riven","mastery_level":8,"mod_rank":8},"minimal_reputation":0,"starting_price":250,"owner":"59b74355d3ffb6516f3960a4","platform":"pc","closed":false,"top_bid":null,"winner":null,"is_marked_for":null,"marked_operation_at":null,"created":"2020-03-03T20:14:25.000+00:00","updated":"2020-03-09T14:18:12.000+00:00","note_raw":"","is_direct_sell":true,"id":"5e5ebaa1ebde7c02656cc8aa"}]')
      this.data = this.data.map(a => {
        a.updated = new Date(a.updated)
        return a
      })
    }
  }
}
</script>
