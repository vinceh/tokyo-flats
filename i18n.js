// The site's own words in four languages, and how each language writes prices and dates.
// Listing text (names, addresses, stations, notes, captions) is data and is never translated.
// A string may hold {name} slots, filled by t(key, vars), and <b>/<strong> around the part shown bold.
// A string that changes with a count is { one, other }; languages without a singular give one string.
(function () {
  'use strict';

  var STRINGS = {
    en: {
      'mode.aria': 'Show',
      'mode.flats': 'Tokyo flats',
      'mode.land': 'Tokyo land',
      'mode.home': 'Ideal home',

      'search.placeholder': 'Search name, address or station',
      'search.aria': 'Search listings by name, address or station',

      'filters.button': 'Filters',
      'filters.buttonActive': 'Filters, {n} active',
      'filters.min': 'Min',
      'filters.max': 'Max',
      'filters.from': 'From',
      'filters.to': 'To',
      'filters.minUnit': 'min',
      'filters.more': '{first} +{n}',

      'toggle.showMap': 'Show map',
      'toggle.showList': 'Show list',

      'price.group': 'Price, millions of yen',
      'price.unit': '¥M',
      'price.minAria': 'Minimum price, millions of yen',
      'price.maxAria': 'Maximum price, millions of yen',

      'area.group': 'Area, square metres',
      'area.minAria': 'Minimum area, square metres',
      'area.maxAria': 'Maximum area, square metres',

      'sort.aria': 'Sort by',
      'sort.price': 'Price',
      'sort.ppm2': 'Price per ㎡',
      'sort.area': 'Area',
      'sort.shinjuku': 'Time to Shinjuku',
      'sort.fees': 'Monthly fees',
      'sort.walk': 'Station walk',
      'sort.drive': 'Time to airport',
      'sort.ascAria': 'Ascending, switch to descending',
      'sort.descAria': 'Descending, switch to ascending',

      'added.aria': 'Listed',
      'added.any': 'Any date',
      'added.today': 'New today',
      'added.yesterday': 'Yesterday',
      'added.option': '{label} · {n}',

      'count.all': '<strong>{n}</strong> listings',
      'count.some': '<strong>{n}</strong> of {total} listings',

      'reset.label': 'Reset',
      'reset.aria': 'Reset filters',

      'lang.aria': 'Language',

      'share.label': 'Share view',
      'share.aria': 'Copy a link to this view',
      'share.copied': 'copied',

      'homeType.any': 'Type: any',
      'homeType.land': 'Vacant land',
      'homeType.oldhouse': 'Old house on lot',
      'homeType.renovated': 'Renovated',
      'homeType.newbuild': 'New build',

      'viewType.any': 'View: any',
      'viewType.sea': 'Sea view',
      'viewType.mountain': 'Mountain view',
      'viewType.lake': 'Lake view',
      'viewType.river': 'River view',
      'viewType.forest': 'Forest view',

      'airport.aria': 'Airport',
      'airport.any': 'Airport: any',
      'airport.NRT': 'Narita',
      'airport.HND': 'Haneda',
      'airport.KIX': 'Kansai',
      'airport.NGO': 'Chubu',
      'airport.FUK': 'Fukuoka',
      'airport.CTS': 'New Chitose',
      'airport.OKA': 'Naha',

      'drive.group': 'Drive to airport, minutes',
      'drive.maxAria': 'Maximum drive to airport, minutes',
      'drive.unit': 'min to airport',

      'walk.group': 'Walk to nearest station, minutes',
      'walk.maxAria': 'Maximum walk to nearest station, minutes',

      'shinjuku.group': 'Time to Shinjuku, minutes',
      'shinjuku.maxAria': 'Maximum time to shinjuku, minutes',
      'shinjuku.unit': 'min to Shinjuku',

      'fees.group': 'Monthly fees, thousands of yen',
      'fees.maxAria': 'Maximum monthly fees, thousands of yen',
      'fees.unit': '¥k/mo',

      'built.group': 'Year built',
      'built.fromAria': 'Built from year',
      'built.toAria': 'Built up to year',

      'gym.group': 'Walk to Anytime Fitness, minutes',
      'gym.maxAria': 'Maximum walk to anytime fitness, minutes',

      'market.group': 'Walk to supermarket, minutes',
      'market.maxAria': 'Maximum walk to supermarket, minutes',

      'lift.aria': 'Lift',
      'lift.any': 'Lift: any',
      'lift.yes': 'Lift confirmed',
      'lift.likely': 'Lift confirmed or likely',

      'shape.any': 'Shape: any',
      'shape.regular': 'Regular',
      'shape.flag': 'Flag lot',
      'shape.irregular': 'Irregular',
      'shape.narrow': 'Narrow frontage',
      'shape.corner': 'Corner',
      'shape.tworoads': 'Two roads',
      'shape.sloped': 'Sloped',
      'shape.unknown': 'Shape unknown',

      'zoning.any': 'Zoning: any',
      'zoning.low1': 'Low-rise residential',
      'zoning.low2': 'Low-rise residential II',
      'zoning.midhigh': 'Mid/high-rise residential',
      'zoning.rural': 'Rural residential',
      'zoning.residential': 'Residential',
      'zoning.neighbourhood_commercial': 'Neighbourhood commercial',
      'zoning.commercial': 'Commercial',
      'zoning.industrial': 'Industrial',
      'zoning.other': 'Other zoning',

      'far.group': 'Floor-area ratio, percent',
      'far.minAria': 'Minimum floor-area ratio, percent',
      'far.unit': '% FAR',

      'road.group': 'Road',
      'road.minAria': 'Minimum road width, metres',
      'road.unit': 'm',
      'road.typeAria': 'Road type',
      'road.any': 'Any road',
      'road.publicOnly': 'Public road only',

      'builder.aria': 'Building conditions',
      'builder.any': 'Builder: any',
      'builder.none': "No seller's builder",

      'setback.aria': 'Setback',
      'setback.any': 'Setback: any',
      'setback.none': 'No setback',

      'lot.aria': 'Lot',
      'lot.any': 'Lot: any',
      'lot.vacant': 'Vacant',
      'lot.oldhouse': 'Old house',

      'pfixed.aria': 'Price type',
      'pfixed.any': 'Price: any',
      'pfixed.fixed': 'Fixed price only',

      'lease.aria': 'Leasehold',
      'lease.owned': 'Owned land only',
      'lease.include': 'Include leasehold',

      'fav.aria': 'Favourites',
      'fav.all': 'All listings',
      'fav.only': 'Favourites only',

      'presets.aria': 'Saved filters',
      'presets.none': 'Saved filters',
      'presets.update': 'Update',
      'presets.updateAria': 'Update selected saved filters with current filters',
      'presets.saveAria': 'Save current filters as new',
      'presets.deleteAria': 'Delete selected saved filters',
      'presets.namePrompt': 'Name for these filters',
      'presets.deleteConfirm': 'Delete saved filters "{name}"?',

      'sheet.closeFilters': 'Close filters',
      'sheet.show': { one: 'Show {n} listing', other: 'Show {n} listings' },

      'layout.list': 'Listings',
      'layout.divider': 'Resize listings and map',
      'layout.map': 'Map',

      'list.empty': 'No listings match these filters.',

      'card.photosOf': 'Photos of {title}',
      'card.prevPhoto': 'Previous photo',
      'card.nextPhoto': 'Next photo',
      'card.new': 'New',
      'card.updated': 'Updated',
      'card.favourite': 'Favourite',
      'card.copyLink': 'Copy link to this listing',
      'card.minWalk': '{n} min walk',
      'card.gym': 'Anytime Fitness · <b>{n} min</b> walk',
      'card.toShinjuku': '~<b>{n} min</b> to Shinjuku',
      'card.drive': '{n} min drive',
      'card.lotArea': '{m2} ㎡ · {tsubo} tsubo',
      'card.built': 'Built <b>{year}</b>',
      'card.floorSuffix': 'F',
      'card.storeys': '{n}F',
      'card.faces': 'Faces <b>{dir}</b>',
      'card.facingUnknown': 'Facing unknown',
      'card.feesNotListed': 'Fees not listed',
      'card.lift': 'Lift',
      'card.noLift': 'No lift',
      'card.liftLikely': 'Lift likely',
      'card.liftUnknown': 'Lift unknown',
      'card.roadUnknown': 'Road unknown',
      'card.zoningUnknown': 'Zoning unknown',

      'dir.N': 'N',
      'dir.NE': 'NE',
      'dir.E': 'E',
      'dir.SE': 'SE',
      'dir.S': 'S',
      'dir.SW': 'SW',
      'dir.W': 'W',
      'dir.NW': 'NW',

      'roadLine.private': 'private road',
      'roadLine.public': 'public road',
      'roadLine.unknown': 'road',
      'roadLine.privateAlone': 'Private road',
      'roadLine.publicAlone': 'Public road',
      'roadLine.sides': '{sides} {kind}',
      'roadLine.width': '{width}m {kind}',
      'roadLine.sideWidth': '{dir} {width}m',
      'roadLine.metres': '{width}m',
      'roadLine.sep': ', ',
      'roadLine.frontage': '{width}m frontage',

      'ratio.both': '{coverage}/{far}%',
      'ratio.far': 'FAR {far}%',
      'ratio.coverage': 'Coverage {coverage}%',

      'flag.setback': 'Setback',
      'flag.builder': "Seller's builder required",
      'flag.oldhouse': 'Old house on lot',
      'flag.leasehold': 'Leasehold',

      'mini.station': '{station} {n} min',
      'mini.shinjuku': 'Shinjuku ~{n} min',
      'mini.airport': '{airport} {n} min drive',
      'mini.close': 'Close',

      'map.walk': '{n} min',
      'map.walkMetres': '{n} min · {m} m',
      'map.drive': '{n} min drive',
      'map.zoomIn': 'Zoom in',
      'map.zoomOut': 'Zoom out',
      'map.new': 'New',
      'map.updated': 'Upd'
    },
    ja: {
      'mode.aria': '表示する物件',
      'mode.flats': '東京マンション',
      'mode.land': '東京土地',
      'mode.home': '理想の住まい',

      'search.placeholder': '物件名・住所・駅名で検索',
      'search.aria': '物件名・住所・駅名で物件を検索',

      'filters.button': '絞り込み',
      'filters.buttonActive': '絞り込み（{n}件設定中）',
      'filters.min': '下限',
      'filters.max': '上限',
      'filters.from': '下限',
      'filters.to': '上限',
      'filters.minUnit': '分',
      'filters.more': '{first} 他{n}件',

      'toggle.showMap': '地図を表示',
      'toggle.showList': '一覧を表示',

      'price.group': '価格（百万円）',
      'price.unit': '百万円',
      'price.minAria': '価格の下限（百万円）',
      'price.maxAria': '価格の上限（百万円）',

      'area.group': '面積（㎡）',
      'area.minAria': '面積の下限（㎡）',
      'area.maxAria': '面積の上限（㎡）',

      'sort.aria': '並び替え',
      'sort.price': '価格',
      'sort.ppm2': '㎡単価',
      'sort.area': '面積',
      'sort.shinjuku': '新宿までの時間',
      'sort.fees': '管理費等',
      'sort.walk': '駅徒歩',
      'sort.drive': '空港までの時間',
      'sort.ascAria': '昇順（降順に切り替え）',
      'sort.descAria': '降順（昇順に切り替え）',

      'added.aria': '掲載日',
      'added.any': '掲載日：指定なし',
      'added.today': '本日の新着',
      'added.yesterday': '昨日',
      'added.option': '{label}（{n}件）',

      'count.all': '<strong>{n}</strong>件',
      'count.some': '全{total}件中 <strong>{n}</strong>件',

      'reset.label': 'リセット',
      'reset.aria': '絞り込み条件をリセット',

      'lang.aria': '言語',

      'share.label': '共有',
      'share.aria': 'この画面のリンクをコピー',
      'share.copied': 'コピーしました',

      'homeType.any': '物件種別：指定なし',
      'homeType.land': '更地',
      'homeType.oldhouse': '古家付き土地',
      'homeType.renovated': 'リノベーション済み',
      'homeType.newbuild': '新築戸建',

      'viewType.any': '眺望：指定なし',
      'viewType.sea': '海が見える',
      'viewType.mountain': '山が見える',
      'viewType.lake': '湖が見える',
      'viewType.river': '川が見える',
      'viewType.forest': '森が見える',

      'airport.aria': '空港',
      'airport.any': '空港：指定なし',
      'airport.NRT': '成田空港',
      'airport.HND': '羽田空港',
      'airport.KIX': '関西国際空港',
      'airport.NGO': '中部国際空港',
      'airport.FUK': '福岡空港',
      'airport.CTS': '新千歳空港',
      'airport.OKA': '那覇空港',

      'drive.group': '空港まで車での所要時間（分）',
      'drive.maxAria': '空港まで車での所要時間の上限（分）',
      'drive.unit': '分（空港まで）',

      'walk.group': '最寄り駅まで徒歩（分）',
      'walk.maxAria': '最寄り駅まで徒歩の上限（分）',

      'shinjuku.group': '新宿までの所要時間（分）',
      'shinjuku.maxAria': '新宿までの所要時間の上限（分）',
      'shinjuku.unit': '分（新宿まで）',

      'fees.group': '管理費・修繕積立金（千円/月）',
      'fees.maxAria': '管理費・修繕積立金の上限（千円/月）',
      'fees.unit': '千円/月',

      'built.group': '築年',
      'built.fromAria': '築年の下限',
      'built.toAria': '築年の上限',

      'gym.group': 'エニタイムフィットネスまで徒歩（分）',
      'gym.maxAria': 'エニタイムフィットネスまで徒歩の上限（分）',

      'market.group': 'スーパーまで徒歩（分）',
      'market.maxAria': 'スーパーまで徒歩の上限（分）',

      'lift.aria': 'エレベーター',
      'lift.any': 'エレベーター：指定なし',
      'lift.yes': 'エレベーターあり',
      'lift.likely': 'エレベーターあり（推定含む）',

      'shape.any': '形状：指定なし',
      'shape.regular': '整形地',
      'shape.flag': '旗竿地',
      'shape.irregular': '不整形地',
      'shape.narrow': '間口狭小',
      'shape.corner': '角地',
      'shape.tworoads': '二方道路',
      'shape.sloped': '傾斜地',
      'shape.unknown': '形状不明',

      'zoning.any': '用途地域：指定なし',
      'zoning.low1': '第一種低層住居専用地域',
      'zoning.low2': '第二種低層住居専用地域',
      'zoning.midhigh': '中高層住居専用地域',
      'zoning.rural': '田園住居地域',
      'zoning.residential': '住居地域・準住居地域',
      'zoning.neighbourhood_commercial': '近隣商業地域',
      'zoning.commercial': '商業地域',
      'zoning.industrial': '工業系地域',
      'zoning.other': 'その他の用途地域',

      'far.group': '容積率（%）',
      'far.minAria': '容積率の下限（%）',
      'far.unit': '%（容積率）',

      'road.group': '前面道路',
      'road.minAria': '前面道路の幅員の下限（m）',
      'road.unit': 'm',
      'road.typeAria': '道路種別',
      'road.any': '道路：指定なし',
      'road.publicOnly': '公道のみ',

      'builder.aria': '建築条件',
      'builder.any': '建築条件：指定なし',
      'builder.none': '建築条件なし',

      'setback.aria': 'セットバック',
      'setback.any': 'セットバック：指定なし',
      'setback.none': 'セットバックなし',

      'lot.aria': '現況',
      'lot.any': '現況：指定なし',
      'lot.vacant': '更地',
      'lot.oldhouse': '古家あり',

      'pfixed.aria': '価格表示',
      'pfixed.any': '価格表示：指定なし',
      'pfixed.fixed': '価格帯表示を除く',

      'lease.aria': '土地権利',
      'lease.owned': '所有権のみ',
      'lease.include': '借地権を含む',

      'fav.aria': 'お気に入り',
      'fav.all': 'すべての物件',
      'fav.only': 'お気に入りのみ',

      'presets.aria': '保存した条件',
      'presets.none': '保存した条件',
      'presets.update': '更新',
      'presets.updateAria': '選択中の保存した条件を現在の条件で更新',
      'presets.saveAria': '現在の条件を新規保存',
      'presets.deleteAria': '選択中の保存した条件を削除',
      'presets.namePrompt': 'この条件の名前を入力してください',
      'presets.deleteConfirm': '保存した条件「{name}」を削除しますか？',

      'sheet.closeFilters': '絞り込みを閉じる',
      'sheet.show': '{n}件を表示',

      'layout.list': '物件一覧',
      'layout.divider': '一覧と地図の幅を調整',
      'layout.map': '地図',

      'list.empty': '条件に一致する物件はありません。',

      'card.photosOf': '{title}の写真',
      'card.prevPhoto': '前の写真',
      'card.nextPhoto': '次の写真',
      'card.new': '新着',
      'card.updated': '価格変更',
      'card.favourite': 'お気に入り',
      'card.copyLink': 'この物件のリンクをコピー',
      'card.minWalk': '徒歩{n}分',
      'card.gym': 'エニタイムフィットネス · 徒歩<b>{n}分</b>',
      'card.toShinjuku': '新宿まで約<b>{n}分</b>',
      'card.drive': '車で{n}分',
      'card.lotArea': '{m2}㎡（{tsubo}坪）',
      'card.built': '<b>{year}</b>年築',
      'card.floorSuffix': '階',
      'card.storeys': '{n}階建',
      'card.faces': '<b>{dir}</b>向き',
      'card.facingUnknown': '向き不明',
      'card.feesNotListed': '管理費等の記載なし',
      'card.lift': 'エレベーターあり',
      'card.noLift': 'エレベーターなし',
      'card.liftLikely': 'エレベーターあり（推定）',
      'card.liftUnknown': 'エレベーター有無不明',
      'card.roadUnknown': '接道不明',
      'card.zoningUnknown': '用途地域不明',

      'dir.N': '北',
      'dir.NE': '北東',
      'dir.E': '東',
      'dir.SE': '南東',
      'dir.S': '南',
      'dir.SW': '南西',
      'dir.W': '西',
      'dir.NW': '北西',

      'roadLine.private': '私道',
      'roadLine.public': '公道',
      'roadLine.unknown': '道路',
      'roadLine.privateAlone': '私道',
      'roadLine.publicAlone': '公道',
      'roadLine.sides': '{sides} {kind}',
      'roadLine.width': '{width}m {kind}',
      'roadLine.sideWidth': '{dir}{width}m',
      'roadLine.metres': '{width}m',
      'roadLine.sep': '、',
      'roadLine.frontage': '間口{width}m',

      'ratio.both': '{coverage}/{far}%',
      'ratio.far': '容積率{far}%',
      'ratio.coverage': '建ぺい率{coverage}%',

      'flag.setback': '要セットバック',
      'flag.builder': '建築条件付き',
      'flag.oldhouse': '古家あり',
      'flag.leasehold': '借地権',

      'mini.station': '{station} 徒歩{n}分',
      'mini.shinjuku': '新宿まで約{n}分',
      'mini.airport': '{airport}まで車で{n}分',
      'mini.close': '閉じる',

      'map.walk': '徒歩{n}分',
      'map.walkMetres': '徒歩{n}分 · {m}m',
      'map.drive': '車で{n}分',
      'map.zoomIn': 'ズームイン',
      'map.zoomOut': 'ズームアウト',
      'map.new': '新着',
      'map.updated': '変更'
    },
    'zh-Hant': {
      'mode.aria': '顯示',
      'mode.flats': '東京公寓',
      'mode.land': '東京土地',
      'mode.home': '理想住宅',

      'search.placeholder': '搜尋名稱、地址或車站',
      'search.aria': '依名稱、地址或車站搜尋物件',

      'filters.button': '篩選',
      'filters.buttonActive': '篩選，已設定 {n} 項',
      'filters.min': '下限',
      'filters.max': '上限',
      'filters.from': '最早',
      'filters.to': '最晚',
      'filters.minUnit': '分鐘',
      'filters.more': '{first} +{n}',

      'toggle.showMap': '顯示地圖',
      'toggle.showList': '顯示列表',

      'price.group': '價格（百萬日圓）',
      'price.unit': '百萬日圓',
      'price.minAria': '最低價格（百萬日圓）',
      'price.maxAria': '最高價格（百萬日圓）',

      'area.group': '面積（平方公尺）',
      'area.minAria': '最小面積（平方公尺）',
      'area.maxAria': '最大面積（平方公尺）',

      'sort.aria': '排序方式',
      'sort.price': '價格',
      'sort.ppm2': '每㎡單價',
      'sort.area': '面積',
      'sort.shinjuku': '到新宿時間',
      'sort.fees': '管理費＋修繕基金',
      'sort.walk': '步行到車站',
      'sort.drive': '到機場車程',
      'sort.ascAria': '由小到大排序，切換為由大到小',
      'sort.descAria': '由大到小排序，切換為由小到大',

      'added.aria': '刊登日期',
      'added.any': '不限日期',
      'added.today': '今日新增',
      'added.yesterday': '昨日',
      'added.option': '{label} · {n}',

      'count.all': '<strong>{n}</strong> 筆物件',
      'count.some': '<strong>{n}</strong> / {total} 筆物件',

      'reset.label': '重設',
      'reset.aria': '重設篩選條件',

      'lang.aria': '語言',

      'share.label': '分享連結',
      'share.aria': '複製此畫面的連結',
      'share.copied': '已複製',

      'homeType.any': '類型：不限',
      'homeType.land': '空地',
      'homeType.oldhouse': '含舊屋土地',
      'homeType.renovated': '翻新中古屋',
      'homeType.newbuild': '新成屋',

      'viewType.any': '景觀：不限',
      'viewType.sea': '海景',
      'viewType.mountain': '山景',
      'viewType.lake': '湖景',
      'viewType.river': '河景',
      'viewType.forest': '森林景觀',

      'airport.aria': '機場',
      'airport.any': '機場：不限',
      'airport.NRT': '成田',
      'airport.HND': '羽田',
      'airport.KIX': '關西',
      'airport.NGO': '中部',
      'airport.FUK': '福岡',
      'airport.CTS': '新千歲',
      'airport.OKA': '那霸',

      'drive.group': '到機場車程（分鐘）',
      'drive.maxAria': '到機場最長車程（分鐘）',
      'drive.unit': '分鐘到機場',

      'walk.group': '步行到最近車站（分鐘）',
      'walk.maxAria': '步行到最近車站最長時間（分鐘）',

      'shinjuku.group': '到新宿時間（分鐘）',
      'shinjuku.maxAria': '到新宿最長時間（分鐘）',
      'shinjuku.unit': '分鐘到新宿',

      'fees.group': '每月管理費＋修繕基金（千日圓）',
      'fees.maxAria': '每月管理費＋修繕基金上限（千日圓）',
      'fees.unit': '千日圓/月',

      'built.group': '完工年份',
      'built.fromAria': '最早完工年份',
      'built.toAria': '最晚完工年份',

      'gym.group': '步行到 Anytime Fitness（分鐘）',
      'gym.maxAria': '步行到 Anytime Fitness 最長時間（分鐘）',

      'market.group': '步行到超市（分鐘）',
      'market.maxAria': '步行到超市最長時間（分鐘）',

      'lift.aria': '電梯',
      'lift.any': '電梯：不限',
      'lift.yes': '確定有電梯',
      'lift.likely': '確定或可能有電梯',

      'shape.any': '形狀：不限',
      'shape.regular': '方正地',
      'shape.flag': '旗竿地',
      'shape.irregular': '不規則地',
      'shape.narrow': '面寬狹窄',
      'shape.corner': '角地',
      'shape.tworoads': '雙面臨路',
      'shape.sloped': '坡地',
      'shape.unknown': '形狀不明',

      'zoning.any': '分區：不限',
      'zoning.low1': '第一種低層住宅區',
      'zoning.low2': '第二種低層住宅區',
      'zoning.midhigh': '中高層住宅區',
      'zoning.rural': '田園住宅區',
      'zoning.residential': '住宅區',
      'zoning.neighbourhood_commercial': '近鄰商業區',
      'zoning.commercial': '商業區',
      'zoning.industrial': '工業區',
      'zoning.other': '其他分區',

      'far.group': '容積率（%）',
      'far.minAria': '容積率下限（%）',
      'far.unit': '%容積率',

      'road.group': '道路',
      'road.minAria': '道路寬度下限（公尺）',
      'road.unit': 'm',
      'road.typeAria': '道路類型',
      'road.any': '不限道路',
      'road.publicOnly': '僅限公有道路',

      'builder.aria': '建築條件',
      'builder.any': '建築條件：不限',
      'builder.none': '無建築條件',

      'setback.aria': '退縮',
      'setback.any': '退縮：不限',
      'setback.none': '無需退縮',

      'lot.aria': '土地現況',
      'lot.any': '現況：不限',
      'lot.vacant': '空地',
      'lot.oldhouse': '含舊屋',

      'pfixed.aria': '價格類型',
      'pfixed.any': '價格：不限',
      'pfixed.fixed': '僅限單一價格',

      'lease.aria': '借地權',
      'lease.owned': '僅限所有權土地',
      'lease.include': '包含借地權',

      'fav.aria': '收藏',
      'fav.all': '全部物件',
      'fav.only': '僅看收藏',

      'presets.aria': '已儲存的篩選',
      'presets.none': '已儲存的篩選',
      'presets.update': '更新',
      'presets.updateAria': '以目前的篩選條件更新所選的已儲存篩選',
      'presets.saveAria': '將目前的篩選條件儲存為新的一組',
      'presets.deleteAria': '刪除所選的已儲存篩選',
      'presets.namePrompt': '為這組篩選條件命名',
      'presets.deleteConfirm': '要刪除已儲存的篩選「{name}」嗎？',

      'sheet.closeFilters': '關閉篩選',
      'sheet.show': '顯示 {n} 筆物件',

      'layout.list': '物件列表',
      'layout.divider': '調整列表與地圖大小',
      'layout.map': '地圖',

      'list.empty': '沒有符合這些篩選條件的物件。',

      'card.photosOf': '{title}的照片',
      'card.prevPhoto': '上一張照片',
      'card.nextPhoto': '下一張照片',
      'card.new': '新上架',
      'card.updated': '調價',
      'card.favourite': '收藏',
      'card.copyLink': '複製此物件的連結',
      'card.minWalk': '步行{n}分鐘',
      'card.gym': 'Anytime Fitness · 步行<b>{n}分鐘</b>',
      'card.toShinjuku': '約<b>{n}分鐘</b>到新宿',
      'card.drive': '車程{n}分鐘',
      'card.lotArea': '{m2} ㎡ · {tsubo} 坪',
      'card.built': '<b>{year}</b>年完工',
      'card.floorSuffix': 'F',
      'card.storeys': '{n}F',
      'card.faces': '<b>{dir}</b>向',
      'card.facingUnknown': '朝向不明',
      'card.feesNotListed': '未提供管理費',
      'card.lift': '有電梯',
      'card.noLift': '無電梯',
      'card.liftLikely': '可能有電梯',
      'card.liftUnknown': '電梯不明',
      'card.roadUnknown': '道路不明',
      'card.zoningUnknown': '分區不明',

      'dir.N': '北',
      'dir.NE': '東北',
      'dir.E': '東',
      'dir.SE': '東南',
      'dir.S': '南',
      'dir.SW': '西南',
      'dir.W': '西',
      'dir.NW': '西北',

      'roadLine.private': '私有道路',
      'roadLine.public': '公有道路',
      'roadLine.unknown': '道路',
      'roadLine.privateAlone': '私有道路',
      'roadLine.publicAlone': '公有道路',
      'roadLine.sides': '{sides} {kind}',
      'roadLine.width': '{width}m {kind}',
      'roadLine.sideWidth': '{dir}側 {width}m',
      'roadLine.metres': '{width}m',
      'roadLine.sep': '、',
      'roadLine.frontage': '面寬 {width}m',

      'ratio.both': '{coverage}/{far}%',
      'ratio.far': '容積率 {far}%',
      'ratio.coverage': '建蔽率 {coverage}%',

      'flag.setback': '需退縮',
      'flag.builder': '附建築條件',
      'flag.oldhouse': '含舊屋',
      'flag.leasehold': '借地權',

      'mini.station': '{station} 步行{n}分鐘',
      'mini.shinjuku': '到新宿約{n}分鐘',
      'mini.airport': '{airport} 車程{n}分鐘',
      'mini.close': '關閉',

      'map.walk': '{n}分鐘',
      'map.walkMetres': '{n}分鐘 · {m} m',
      'map.drive': '車程{n}分鐘',
      'map.zoomIn': '放大',
      'map.zoomOut': '縮小',
      'map.new': '新',
      'map.updated': '調價'
    },
    'zh-Hans': {
      'mode.aria': '显示',
      'mode.flats': '东京公寓',
      'mode.land': '东京土地',
      'mode.home': '理想之家',

      'search.placeholder': '搜索名称、地址或车站',
      'search.aria': '按名称、地址或车站搜索房源',

      'filters.button': '筛选',
      'filters.buttonActive': '筛选，已选{n}项',
      'filters.min': '最低',
      'filters.max': '最高',
      'filters.from': '最早',
      'filters.to': '最晚',
      'filters.minUnit': '分钟',
      'filters.more': '{first} +{n}',

      'toggle.showMap': '显示地图',
      'toggle.showList': '显示列表',

      'price.group': '价格（百万日元）',
      'price.unit': '百万日元',
      'price.minAria': '最低价格（百万日元）',
      'price.maxAria': '最高价格（百万日元）',

      'area.group': '面积（平方米）',
      'area.minAria': '最小面积（平方米）',
      'area.maxAria': '最大面积（平方米）',

      'sort.aria': '排序方式',
      'sort.price': '价格',
      'sort.ppm2': '每平米单价',
      'sort.area': '面积',
      'sort.shinjuku': '到新宿时间',
      'sort.fees': '每月管理修缮费',
      'sort.walk': '步行到车站',
      'sort.drive': '到机场车程',
      'sort.ascAria': '升序，点击切换为降序',
      'sort.descAria': '降序，点击切换为升序',

      'added.aria': '上架日期',
      'added.any': '不限日期',
      'added.today': '今日新上',
      'added.yesterday': '昨天',
      'added.option': '{label} · {n}',

      'count.all': '<strong>{n}</strong> 个房源',
      'count.some': '<strong>{n}</strong> / {total} 个房源',

      'reset.label': '重置',
      'reset.aria': '重置筛选',

      'lang.aria': '语言',

      'share.label': '分享当前视图',
      'share.aria': '复制当前视图的链接',
      'share.copied': '已复制',

      'homeType.any': '类型：不限',
      'homeType.land': '空地',
      'homeType.oldhouse': '带旧房土地',
      'homeType.renovated': '翻新独栋',
      'homeType.newbuild': '新建独栋',

      'viewType.any': '景观：不限',
      'viewType.sea': '海景',
      'viewType.mountain': '山景',
      'viewType.lake': '湖景',
      'viewType.river': '河景',
      'viewType.forest': '林景',

      'airport.aria': '机场',
      'airport.any': '机场：不限',
      'airport.NRT': '成田机场',
      'airport.HND': '羽田机场',
      'airport.KIX': '关西机场',
      'airport.NGO': '中部机场',
      'airport.FUK': '福冈机场',
      'airport.CTS': '新千岁机场',
      'airport.OKA': '那霸机场',

      'drive.group': '到机场车程（分钟）',
      'drive.maxAria': '到机场最长车程（分钟）',
      'drive.unit': '分钟内到机场',

      'walk.group': '步行到最近车站（分钟）',
      'walk.maxAria': '步行到最近车站的最长时间（分钟）',

      'shinjuku.group': '到新宿时间（分钟）',
      'shinjuku.maxAria': '到新宿的最长时间（分钟）',
      'shinjuku.unit': '分钟内到新宿',

      'fees.group': '每月管理修缮费（千日元）',
      'fees.maxAria': '每月管理修缮费上限（千日元）',
      'fees.unit': '千日元/月',

      'built.group': '建成年份',
      'built.fromAria': '最早建成年份',
      'built.toAria': '最晚建成年份',

      'gym.group': '步行到 Anytime Fitness（分钟）',
      'gym.maxAria': '步行到 Anytime Fitness 的最长时间（分钟）',

      'market.group': '步行到超市（分钟）',
      'market.maxAria': '步行到超市的最长时间（分钟）',

      'lift.aria': '电梯',
      'lift.any': '电梯：不限',
      'lift.yes': '确认有电梯',
      'lift.likely': '确认或可能有电梯',

      'shape.any': '形状：不限',
      'shape.regular': '规整地块',
      'shape.flag': '旗杆地',
      'shape.irregular': '不规则地块',
      'shape.narrow': '面宽较窄',
      'shape.corner': '转角地',
      'shape.tworoads': '前后临路',
      'shape.sloped': '坡地',
      'shape.unknown': '形状不明',

      'zoning.any': '用途地域：不限',
      'zoning.low1': '第一种低层住居专用地域',
      'zoning.low2': '第二种低层住居专用地域',
      'zoning.midhigh': '中高层住居专用地域',
      'zoning.rural': '田园住居地域',
      'zoning.residential': '住居地域（含准住居）',
      'zoning.neighbourhood_commercial': '近邻商业地域',
      'zoning.commercial': '商业地域',
      'zoning.industrial': '工业地域（含准工业等）',
      'zoning.other': '其他用途地域',

      'far.group': '容积率（%）',
      'far.minAria': '最低容积率（%）',
      'far.unit': '% 容积率',

      'road.group': '道路',
      'road.minAria': '最小道路宽度（米）',
      'road.unit': '米',
      'road.typeAria': '道路类型',
      'road.any': '道路类型：不限',
      'road.publicOnly': '仅限公共道路',

      'builder.aria': '指定建筑商',
      'builder.any': '指定建筑商：不限',
      'builder.none': '无指定建筑商',

      'setback.aria': '道路退让',
      'setback.any': '退让：不限',
      'setback.none': '无需退让',

      'lot.aria': '地块现状',
      'lot.any': '现状：不限',
      'lot.vacant': '空地',
      'lot.oldhouse': '带旧房',

      'pfixed.aria': '价格类型',
      'pfixed.any': '价格类型：不限',
      'pfixed.fixed': '仅限单一价格',

      'lease.aria': '借地权',
      'lease.owned': '仅所有权土地',
      'lease.include': '含借地权',

      'fav.aria': '收藏',
      'fav.all': '全部房源',
      'fav.only': '仅看收藏',

      'presets.aria': '已保存的筛选',
      'presets.none': '已保存的筛选',
      'presets.update': '更新',
      'presets.updateAria': '用当前筛选更新所选的已保存筛选',
      'presets.saveAria': '将当前筛选另存为一组新筛选',
      'presets.deleteAria': '删除所选的已保存筛选',
      'presets.namePrompt': '为这组筛选命名',
      'presets.deleteConfirm': '删除已保存的筛选“{name}”？',

      'sheet.closeFilters': '关闭筛选',
      'sheet.show': '查看 {n} 个房源',

      'layout.list': '房源列表',
      'layout.divider': '调整列表与地图的大小',
      'layout.map': '地图',

      'list.empty': '没有符合筛选条件的房源。',

      'card.photosOf': '{title}的照片',
      'card.prevPhoto': '上一张',
      'card.nextPhoto': '下一张',
      'card.new': '新',
      'card.updated': '调价',
      'card.favourite': '收藏',
      'card.copyLink': '复制此房源的链接',
      'card.minWalk': '步行{n}分钟',
      'card.gym': 'Anytime Fitness · 步行<b>{n}分钟</b>',
      'card.toShinjuku': '到新宿约<b>{n}分钟</b>',
      'card.drive': '车程{n}分钟',
      'card.lotArea': '{m2} ㎡ · {tsubo} 坪',
      'card.built': '<b>{year}</b>年建成',
      'card.floorSuffix': '层',
      'card.storeys': '共{n}层',
      'card.faces': '朝<b>{dir}</b>',
      'card.facingUnknown': '朝向不明',
      'card.feesNotListed': '管理修缮费未标注',
      'card.lift': '有电梯',
      'card.noLift': '无电梯',
      'card.liftLikely': '可能有电梯',
      'card.liftUnknown': '电梯情况不明',
      'card.roadUnknown': '道路情况不明',
      'card.zoningUnknown': '用途地域不明',

      'dir.N': '北',
      'dir.NE': '东北',
      'dir.E': '东',
      'dir.SE': '东南',
      'dir.S': '南',
      'dir.SW': '西南',
      'dir.W': '西',
      'dir.NW': '西北',

      'roadLine.private': '私道',
      'roadLine.public': '公共道路',
      'roadLine.unknown': '道路',
      'roadLine.privateAlone': '私道',
      'roadLine.publicAlone': '公共道路',
      'roadLine.sides': '{sides} {kind}',
      'roadLine.width': '{width}米{kind}',
      'roadLine.sideWidth': '{dir}侧{width}米',
      'roadLine.metres': '{width}米',
      'roadLine.sep': '、',
      'roadLine.frontage': '面宽{width}米',

      'ratio.both': '{coverage}/{far}%',
      'ratio.far': '容积率{far}%',
      'ratio.coverage': '建筑密度{coverage}%',

      'flag.setback': '需退让用地',
      'flag.builder': '需用指定建筑商',
      'flag.oldhouse': '带旧房',
      'flag.leasehold': '借地权',

      'mini.station': '{station} 步行{n}分钟',
      'mini.shinjuku': '到新宿约{n}分钟',
      'mini.airport': '{airport} 车程{n}分钟',
      'mini.close': '关闭',

      'map.walk': '{n}分钟',
      'map.walkMetres': '{n}分钟 · {m}米',
      'map.drive': '车程{n}分钟',
      'map.zoomIn': '放大',
      'map.zoomOut': '缩小',
      'map.new': '新',
      'map.updated': '调价'
    }
  };

  // Prices arrive in 万円 (10,000 yen). English keeps the site's ¥M / ¥k style; Japanese and
  // Chinese write 万/萬 and 億/亿 with their own word for yen.
  var group = function (n, digits) { return n.toLocaleString('en-US', { maximumFractionDigits: digits || 0 }); };
  var EN = {
    htmlLang: 'en',
    dateLocale: 'en-GB',
    price: function (man) { return '¥' + (man / 100).toFixed(1) + 'M'; },
    pin: function (man) { return this.price(man); },
    priceRange: function (lo, hi) { return this.price(lo) + '–' + (hi / 100).toFixed(1) + 'M'; },
    perM2: function (man) { var k = man * 10; return k >= 1000 ? '¥' + (k / 1000).toFixed(2) + 'M/㎡' : '¥' + Math.round(k) + 'k/㎡'; },
    perTsubo: function (man) { var k = man * 10; return k >= 1000 ? '¥' + (k / 1000).toFixed(1) + 'M/tsubo' : '¥' + Math.round(k) + 'k/tsubo'; },
    fees: function (yen) { return '¥' + yen.toLocaleString('en-US') + '/mo'; }
  };
  function eastAsian(u) {
    // 7,580万円 · 1億4,990万円 · 2億円; yen = '' leaves the currency word off.
    var big = function (man, yen) {
      man = Math.round(man);
      if (yen == null) yen = u.yen;
      if (man < 10000) return group(man) + u.man + yen;
      var oku = Math.floor(man / 10000), rest = man % 10000;
      return oku + u.oku + (rest ? group(rest) + u.man : '') + yen;
    };
    // 54.6万円/㎡ · 180万円/坪; under 1万 it is written in plain yen.
    var per = function (man, unit) {
      if (man < 1) return group(Math.round(man * 10000)) + u.yen + '/' + unit;
      return group(man, man >= 100 ? 0 : 1) + u.man + u.yen + '/' + unit;
    };
    return {
      htmlLang: u.htmlLang,
      dateLocale: u.dateLocale,
      price: function (man) { return big(man); },
      // Map price pins: Chinese drops 日圓/日元 so neighbouring pins don't overlap (Vin, 2026-10-21).
      pin: function (man) { return big(man, u.pinYen ? u.yen : ''); },
      priceRange: function (lo, hi) { return big(lo) + u.range + big(hi); },
      perM2: function (man) { return per(man, '㎡'); },
      perTsubo: function (man) { return per(man, '坪'); },
      fees: function (yen) { return group(yen) + u.yen + '/' + u.month; }
    };
  }
  var FORMATS = {
    en: EN,
    ja: eastAsian({ htmlLang: 'ja', dateLocale: 'ja-JP', man: '万', oku: '億', yen: '円', pinYen: true, month: '月', range: '〜' }),
    'zh-Hant': eastAsian({ htmlLang: 'zh-Hant-TW', dateLocale: 'zh-TW', man: '萬', oku: '億', yen: '日圓', month: '月', range: '–' }),
    'zh-Hans': eastAsian({ htmlLang: 'zh-Hans-CN', dateLocale: 'zh-CN', man: '万', oku: '亿', yen: '日元', month: '月', range: '–' })
  };

  var LANG_KEY = 'flat-tracker-lang';
  var lang = 'en';
  try { lang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) {}
  if (!FORMATS[lang]) lang = 'en';

  function t(key, vars) {
    var s = (STRINGS[lang] || {})[key];
    if (s == null) s = STRINGS.en[key];
    if (s == null) return key;
    if (typeof s === 'object') s = s[new Intl.PluralRules(FORMATS[lang].htmlLang).select(vars.n)] || s.other;
    return !vars ? s : s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }

  // Static page text: data-i18n fills the text, data-i18n-aria the aria-label,
  // data-i18n-placeholder the placeholder.
  function apply(root) {
    [['i18n', null], ['i18nAria', 'aria-label'], ['i18nPlaceholder', 'placeholder']].forEach(function (a) {
      var sel = '[data-' + a[0].replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); }) + ']';
      [].forEach.call((root || document).querySelectorAll(sel), function (el) {
        if (a[1]) el.setAttribute(a[1], t(el.dataset[a[0]]));
        else el.textContent = t(el.dataset[a[0]]);
      });
    });
  }

  function setLang(l) {
    if (!FORMATS[l]) return;
    lang = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    document.documentElement.lang = FORMATS[l].htmlLang;
  }
  document.documentElement.lang = FORMATS[lang].htmlLang;

  window.I18N = {
    strings: STRINGS,
    t: t,
    apply: apply,
    setLang: setLang,
    lang: function () { return lang; },
    fmt: function () { return FORMATS[lang]; }
  };
})();
