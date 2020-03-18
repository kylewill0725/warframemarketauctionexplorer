<template>
  <div class="home">
    <h1>
    Qwyll's Rivens
    </h1>
    <b-form-input v-model="filter" type="search" placeholder="Type to filter"/>

    <b-table hover bordered class="w-100" :fields="this.fields" :items="this.data | sellOrders" :sort-by.sync="sortBy" :filter="filter">
      <template v-slot:cell(weapon)="{ item }">
        {{ item.item.weapon  }}
      </template>
      <template v-slot:cell(name)="{ item }">
        {{ item.item.name }}
      </template>
      <template v-slot:cell(starting_price)="{ item }">
        {{ item.starting_price }}
      </template>
      <template v-slot:cell(rolls)="{ item }">
        {{ item.item.re_rolls }}
      </template>
      <template v-slot:cell(masteryRank)="{ item }">
        {{ item.item.mastery_level }}
      </template>
      <template v-slot:cell(polarity)="{ item }">
        {{ item.item.polarity }}
      </template>
      <template v-slot:cell(stats)="{ item }">
        <b-col>
          <div class="stats" :key="stat.name" v-for="stat in positiveStats(item.item.attributes)">
            {{ stat.name }}: {{stat.value}}
          </div>
        </b-col>
        <b-col>
          <div class="stats" :key="stat.name" v-for="stat in negativeStats(item.item.attributes)">
            {{ stat.name }}: {{stat.value}}
          </div>
        </b-col>
      </template>
      <template v-slot:cell(auctionLink)="{ item }">
        <a :href="'https://warframe.market/auction/' + item.id">Link</a>
      </template>
      <template v-slot:cell(messageLink)="{ item }">
        <a href="#" v-on:click="() => $copyText(`/w Qwyll I'd like to buy ${item.item.weapon} ${item.item.name} for ${item.starting_price}p`)" >Copy</a>
      </template>
    </b-table>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Auction as AuctionType } from '@/types/index.ts'
import Component from 'vue-class-component'
import { BTable, BCol, BFormInput } from 'bootstrap-vue'
import { translate } from '@/types/url_names.ts'

@Component({
  components: {
    BTable,
    BCol,
    BFormInput
  },
  filters: {
    notClosed: function (auctions: AuctionType[]) {
      return auctions.filter(a => !a.closed)
    },
    sellOrders: function (auctions: AuctionType[]) {
      return auctions.filter(a => a.is_direct_sell)
    }
  }
})
export default class AuctionList extends Vue {
  data: AuctionType[] = []
  filter = ''
  sortBy = 'weapon'
  fields = [
    { key: 'weapon', sortable: true, sortByFormatted: true, formatter: function (value: never, key: string, item: AuctionType) { return item.item.weapon } },
    { key: 'name' },
    { key: 'starting_price', sortable: true, label: 'Price' },
    'rolls',
    'masteryRank',
    'polarity',
    'stats',
    'auctionLink',
    { key: 'messageLink', label: 'Copy Whisper' }
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
        this.data = json.payload.auctions.filter((a: AuctionType) => a.is_direct_sell).map((a: AuctionType) => {
          a.updated = new Date(a.updated)
          a.item.weapon = translate(a.item.weapon_url_name)
          a.item.attributes.forEach(s => {
            s.name = translate(s.url_name)
          })
          return a
        })
      }).catch(e => {
        console.log(e)
      })
    } else {
      this.data = JSON.parse('[{"buyout_price":250,"private":false,"note":"","item":{"re_rolls":8,"polarity":"naramon","name":"crita-visiada","weapon_url_name":"arca_plasmor","attributes":[{"value":82.6,"positive":true,"url_name":"base_damage_/_melee_damage"},{"value":45.2,"positive":true,"url_name":"critical_chance"},{"value":22.2,"positive":true,"url_name":"damage_vs_infested"},{"value":-20,"positive":false,"url_name":"magazine_capacity"}],"type":"riven","mastery_level":8,"mod_rank":8},"minimal_reputation":0,"starting_price":250,"owner":"59b74355d3ffb6516f3960a4","platform":"pc","closed":false,"top_bid":null,"winner":null,"is_marked_for":null,"marked_operation_at":null,"created":"2020-03-03T20:14:25.000+00:00","updated":"2020-03-09T14:18:12.000+00:00","note_raw":"","is_direct_sell":true,"id":"5e5ebaa1ebde7c02656cc8aa"},{"starting_price": 35, "minimal_reputation": 0, "buyout_price": 35, "item": {"type": "riven", "attributes": [{"positive": true, "value": 6.1, "url_name": "status_chance"}, {"positive": true, "value": 3.0, "url_name": "damage_vs_grineer"}, {"positive": true, "value": 6.0, "url_name": "critical_damage"}], "polarity": "vazarin", "mastery_level": 14, "name": "argi-hexatis", "mod_rank": 0, "re_rolls": 1, "weapon_url_name": "jat_kittag"}, "private": false, "note": "", "owner": "59b74355d3ffb6516f3960a4", "platform": "pc", "closed": false, "top_bid": null, "winner": null, "is_marked_for": null, "marked_operation_at": null, "created": "2020-03-04T15:30:13.000+00:00", "updated": "2020-03-04T15:30:13.000+00:00", "note_raw": "", "is_direct_sell": true, "id": "5e5fc985da7f610261cb61df"}]')
      this.data = this.data.map(a => {
        a.updated = new Date(a.updated)
        a.item.weapon = translate(a.item.weapon_url_name)
        a.item.attributes.forEach(s => {
          s.name = translate(s.url_name)
        })
        return a
      })
    }
  }
}
</script>
<style scoped>
.stats {
  font-size: 75%;
}
</style>
