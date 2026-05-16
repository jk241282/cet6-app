// 翻译真题种子 - 全部来自2020-2024 CET-6真实考题
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
await initDb(); const db=getDb();
db.run(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf-8'));
db.run('DELETE FROM translation_exercises');
const iT=db.prepare('INSERT INTO translation_exercises (source_text_cn,reference_en,key_points,difficulty,exam_year) VALUES (?,?,?,?,?)');

const trans:[string,string,string,number,string][]=[
// === 2024年12月 ===
['遨游太空历来是中华民族的梦想。2003年，神舟五号飞船发射成功，杨利伟成为第一个飞入太空的中国宇航员。2008年，神舟七号升空，翟志刚成为中国历史上首位进行太空行走的宇航员。近年来，中国航天进入创新发展"快车道"，太空基础设施建设稳步推进，中国空间站于2022年全面建成。中国航天事业的迅速发展在中华民族的历史上写下了辉煌一页，也为人类文明进步做出了巨大贡献。',
'Space exploration has always been a dream of the Chinese nation. In 2003, the successful launch of the Shenzhou-5 spacecraft made Yang Liwei the first Chinese astronaut to travel into space. In 2008, Shenzhou-7 took off, and Zhai Zhigang became the first Chinese astronaut to conduct a spacewalk in Chinese history. In recent years, China\'s space industry has entered a "fast lane" of innovative development, with steady progress in space infrastructure construction. The China Space Station was fully completed in 2022. The rapid development of China\'s space endeavors has written a glorious chapter in the history of the Chinese nation and made tremendous contributions to the progress of human civilization.',
'航天space exploration,宇航员astronaut,太空行走spacewalk,空间站space station,快车道fast lane,辉煌一页glorious chapter',4,'2024-12'],

['北斗卫星导航系统的成功研制，是中国自从改革开放以来一项重大的技术进步。研发人员经过不懈努力，攻克了一系列技术难题，成功地实现了全球覆盖和高精度定位，使中国成为少数几个独立拥有卫星定位导航系统的国家之一。北斗系统已经广泛地运用于公共交通，灾害救援，天气预测、公共安全等诸多领域。',
'The successful development of the BeiDou Satellite Navigation System is a significant technological advancement for China since the reform and opening-up. The research and development team, through relentless efforts, overcame a series of technical challenges, successfully achieving global coverage and high-precision positioning, making China one of the few countries with an independent satellite positioning and navigation system. The BeiDou system has been widely applied in public transportation, disaster rescue, weather forecasting, public safety, and many other fields.',
'北斗卫星导航系统BeiDou Satellite Navigation System,改革开放reform and opening-up,全球覆盖global coverage,高精度定位high-precision positioning,攻克技术难题overcame technical challenges',4,'2024-12'],

['洋山港，是上海航运中心的重要组成部分，是中国第一个深水港，也是世界上规模最大的深水港之一。经过近20年的建设，洋山港已实现高度自动化，数字技术和人工智能的使用大大减少了用工成本和碳排放，自主研发的码头管理系统能够在百公里外对大型设备进行远程操控。',
'Yangshan Port is an important part of the Shanghai shipping center, China\'s first deep-water port, and one of the largest deep-water ports in the world. After nearly 20 years of construction, Yangshan Port has achieved a high degree of automation, with the use of digital technology and artificial intelligence greatly reducing labor costs and carbon emissions. The independently developed terminal management system can remotely control large equipment from more than 100 kilometers away.',
'深水港deep-water port,自动化automation,碳排放carbon emissions,远程操控remotely control,自主研发independently developed',4,'2024-12'],

// === 2024年6月 ===
['中国盛产竹子，是最早开发利用竹资源的国家。竹子在中国分布广泛，品种丰富。竹子实用性强，用于生产和生活的许多方面，如筷子、桌椅的制作和桥梁、房屋的建造。中国人爱竹，自古以来就有无数文人以竹为主题，创作了绚丽多彩的文学和绘画作品。竹子主干笔直，象征正直的品格。竹子具有强大的生命力和适应能力，无论环境多么恶劣，都能够顽强生存，因而寓意坚韧不拔的精神。几千年来，竹子一直被视为中华民族品格的象征。',
'China is abundant in bamboo and is the first country to develop and utilize bamboo resources. Bamboo is widely distributed across China and comes in a rich variety of species. It is highly practical and is used in many aspects of production and daily life, such as making chopsticks, tables, and chairs, as well as constructing bridges and houses. Chinese people have a deep affection for bamboo. Since ancient times, countless literati have taken bamboo as their theme, creating a rich tapestry of literary and artistic works. The straight stem of bamboo symbolizes integrity. Bamboo possesses strong vitality and adaptability, able to thrive tenaciously regardless of how harsh the environment is, thus embodying the spirit of perseverance. For thousands of years, bamboo has been regarded as a symbol of the character of the Chinese nation.',
'竹子bamboo,开发利用develop and utilize,文人literati,正直integrity,坚韧不拔perseverance,象征symbol',4,'2024-06'],

['中国传统婚礼习俗历史悠久。早在周代，就已形成了一套完整的婚礼礼仪，其中有些沿用至今。如今，中国婚礼习俗已有很大变化，但婚礼仍然是一个十分隆重的场合。婚礼场地经过精心装饰，以象征喜庆的红色为主色调，摆放许多寓意美好的物品。新郎新娘在婚礼上要拜天地、拜父母、互相对拜，然后设宴招待宾客，并向宾客敬酒。',
'Traditional Chinese wedding customs have a long history. A complete set of wedding ceremonies were gradually formed in the Zhou Dynasty, and some of them are still in use today. Nowadays, although Chinese wedding conventions have changed a lot, the ceremony is still a very grand occasion, when the wedding venue is carefully decorated, with red as the main color to symbolize happiness, and with many special objects placed to wish the couple well-being. At the wedding ceremony, the couple should bow to heaven and earth, to their parents and to each other, and afterwards hold a banquet to entertain and toast to the guests.',
'婚礼习俗wedding customs,周代Zhou Dynasty,隆重grand,拜天地bow to heaven and earth,寓意美好的物品objects to wish well-being',4,'2024-06'],

['成语是汉语中的一种独特的表达方式，大多由四个汉字组成。它们高度简练且形式固定，但通常能形象地表达深刻的含义。成语大多数来源于中国古代的文学作品，通常与某些神话、传说或者历史事件有关。如果不知道某个成语的出处，就很难理解其确切含义。恰当使用成语可以使一个人的语言更具表现力，交流更有效。',
'Chinese idioms are a unique type of Chinese expression, most of which consist of four characters. Though highly compact and structurally fixed, they usually can express profound meanings vividly. Chinese idioms are mostly derived from ancient literature, and often linked with certain myths, stories or historical facts. The precise meaning of an idiom can be difficult to understand without the knowledge of its origin. Proper use of Chinese idioms can make one\'s words more expressive and communication more effective.',
'成语idioms,简练compact,深刻的含义profound meanings,出处origin,表现力expressive',4,'2024-06'],

// === 2023年12月 老龄化三套 ===
['随着经济与社会的发展，中国人口结构发生了显著变化，逐渐步入老龄化社会。中国老年人口将继续增加，人口老龄化趋势将更加明显。为了应对人口老龄化带来的种种挑战，国家正积极采取措施，加大对养老的支持。通过改革社会保障制度，政府不断增加社会保障经费，逐步扩大社会保障覆盖范围，使更多老年人受益。',
'With the development of economy and society, there has been a significant change in the population structure in China, gradually transitioning into an aging society. It is expected that China\'s elderly population will continue to increase, and the trend of population aging will become more obvious. To cope with various challenges brought about by population aging, the country is actively taking measures to strengthen support for elderly care. Through the reform of the social security system, the government has continuously increased social security funds and gradually expanded the coverage of social security in order to benefit more elderly people.',
'老龄化aging society,人口结构population structure,社会保障social security,覆盖范围coverage',4,'2023-12'],

['在中国，随着老龄化社会的到来，养老受到普遍关注。人们谈论最多的是应当采取什么样的养老模式。多数人认为，养老模式需要多元化。可以通过政府引导和社会参与，建立更多更好的养老服务机构，改进社区服务中心，鼓励居家自助养老，还可以推行家庭养老与社会养老相结合的模式。',
'As China is facing an ageing society, there is a widespread concern over the issue of elderly care. What kind of care model for the elderly should be adopted is the most debated topic. The majority of people believe that the care model for the elderly should be diversified. More and better elderly service institutions can be established, community service centres can be improved, and self-care for the elderly at home can be encouraged through government guidance and social participation. It is also possible to promote a model of the elderly that combines family and social care.',
'养老elderly care,多元化diversified,养老服务机构elderly service institutions,居家自助养老self-care at home,政府引导government guidance',4,'2023-12'],

['近年来，中国老龄人口持续增长。中国政府正采取各种措施，推进养老服务体系建设，使老年人晚年生活健康幸福。全国兴建了各类养老服务机构，为了提升养老机构的服务质量，政府颁布了一系列标准，加强对养老机构的监管。许多城市为方便老年人用餐，开设了社区食堂，为他们提供价格实惠的饭菜。同时，中国还在积极探索居家和社区养老等其他养老模式，以确保所有老年人老有所养。',
'In recent years, China\'s elderly population has continued to grow. The Chinese government is taking various measures to promote the construction of a service system for the elderly, so that the elderly can live a healthy and happy life in their later years. Various service institutions for the elderly have been built across the country. In order to improve the service quality of elderly care institutions, the government has issued a series of standards to strengthen the supervision of elderly care institutions. In order to make it easier for the elderly to eat, many cities have opened community canteens to provide them with affordable meals. At the same time, China is also actively exploring other old-age care models, such as home-based and community old-age care, to ensure that all elderly people have adequate old-age support.',
'养老服务elderly care services,社区食堂community canteens,居家养老home-based care,老有所养adequate old-age support',4,'2023-12'],

// === 2023年6月 ===
['近年来，越来越多的中国文化产品走向全球市场，日益受到海外消费者的青睐。随着中国对外文化贸易的快速发展，中国文化产品出口额已持续多年位居世界前列，形成了一批具有国际影响力的文化企业、产品和品牌。数据显示，中国的出版物、影视作品、网络文学与动漫作品等在海外的销售量连年攀升。中国政府出台了一系列政策鼓励和支持更多具有中国元素的优秀文化产品走出国门。',
'In recent years, an increasing number of Chinese cultural products have entered the global market, gaining growing popularity among overseas consumers. Propelled by the rapid growth of China\'s foreign cultural trade, the export volume of Chinese cultural products has maintained a high rank globally for many years, and a group of cultural enterprises, products and brands with international influence have been established. Statistical data reveals that the sales volume of Chinese publications, films and television programs, online literature, and animation products overseas has increased year after year. The Chinese government has introduced a series of policies to encourage and support more outstanding cultural products with Chinese elements to go abroad.',
'文化产品cultural products,出口额export volume,出版物publications,网络文学online literature,中国元素Chinese elements',4,'2023-06'],

['随着中国经济的快速发展和人们生活水平的稳步提高，城市居民对环境和生活品质的要求越来越高。中国地方政府更加注重公共设施的建设和改进，以更好地满足人们的需求。通过兴建新的广场公园和公共绿地或对原有公共场地重新加以规划改造，许多城市为市民提供了更多休闲和社交的场所。如今，政府出资购置的健身器械和铺设的健身步道在不少城市随处可见。',
'With the rapid development of China\'s economy and the steady improvement of people\'s living standards, urban residents have increasingly higher demands for the environment and quality of life. Local governments in China are placing greater emphasis on constructing and enhancing public facilities to better meet the needs of the people. By building new squares, parks, and public green spaces or transforming existing public areas, many cities provide residents with more recreational and social spaces. Nowadays, government-funded fitness equipment and paved fitness trails can be seen everywhere in many cities.',
'公共设施public facilities,生活水平living standards,公共绿地public green spaces,健身器械fitness equipment',3,'2023-06'],

['近年来，中国城市加快发展，城市人居环境得到显著改善。许多城市努力探索中国特色的城市高质量发展之路，城市功能不断完善，治理水平明显提高。中国持续开展城市生态修复和功能修补，全面实施城镇老旧小区改造，大力推进城市园林绿化，消除污染；同时大力推进城市基础设施体系化建设，努力为市民创造高品质的生活环境，让城市更美丽、更安全、更宜居。',
'In recent years, China\'s cities have accelerated their development and the urban living environment has been significantly improved. Many cities have been making great efforts to explore the path of high-quality urban development with Chinese characteristics, resulting in continuous improvement of urban functions and a noticeable increase in the level of governance. China continues to carry out urban ecological restoration and functional repair, fully implement the renovation of old urban neighborhoods, and vigorously promote urban landscaping to eliminate pollution. At the same time, China vigorously promotes the systematic construction of urban infrastructure and strives to create a high-quality living environment for citizens and make the city more beautiful, safer and more livable.',
'人居环境living environment,生态修复ecological restoration,老旧小区改造renovation of old neighborhoods,基础设施infrastructure,宜居livable',4,'2023-06'],

// === 2022年12月 三大高原 ===
['黄土高原是中国第三大高原，面积约60万平方公里，平均海拔1000-2000米，绝大部分覆盖着50-80米厚的黄土，是世界上黄土分布最集中、覆盖厚度最大的区域。这是大自然创造的一个奇迹。黄土高原是中华民族的发祥地之一。早在5500年前，人们就已经在黄土高原上开始农耕。如今，随着西部大开发战略的实施，黄土高原地区的经济得到了迅速发展。',
'The Loess Plateau, the third largest plateau in China, covers an area of 600,000 square kilometres and rises 1,000-2,000 metres above the sea level on average. As the majority of the plateau is covered with 50-80 metre thick layer of loess, it is the most concentrated area in loess distribution in the world. Therefore, it is well recognized as a miracle created by nature. The Loess Plateau is one of the cradles of the Chinese nation where Chinese began farming 5,500 years ago. Today, with the Western Development strategy implemented, the economy of the Loess Plateau area is developing rapidly.',
'黄土高原Loess Plateau,海拔above the sea level,发祥地cradle,农耕farming,西部大开发Western Development',4,'2022-12'],
['云贵高原大部分位于云南、贵州省境内，总面积约50万平方公里，平均海拔2000-4000米，是中国第四大高原。云贵高原西高东低，河流众多，形成了许多又深又陡的峡谷。云贵高原独特的自然环境造就了生物和文化的多样性。它是中国森林和矿产资源类型十分丰富的地区，也是古人类起源的重要地区。',
'The Yunnan-Guizhou Plateau, located mostly in Yunnan Province and Guizhou Province, is the fourth largest plateau in China which covers a total area of 0.5 million square kilometres and rises 2,000-4,000 metres above the sea level on average. The plateau slopes from the west to the east with many rivers flowing through, gradually forming a lot of steep canyons. The unique natural environment of the plateau contributes to great biological and cultural diversity. It is well recognized as both an area rich in forest and mineral resources and an important human cradle.',
'云贵高原Yunnan-Guizhou Plateau,峡谷canyons,生物多样性biological diversity,矿产资源mineral resources,古人类起源human cradle',4,'2022-12'],
['青藏高原位于中国西南部，面积约230万平方公里，平均海拔4000米以上，被称为"世界屋脊"。青藏高原自然资源丰富，风景秀丽，拥有多种珍稀野生动物。这里是亚洲许多著名河流的源头，是中国和东南亚的主要淡水供应源。青藏高原对全球生态系统至关重要。中国一直在努力保护青藏高原的生态系统，草地覆盖率不断增加，许多濒危物种得到了有效的保护。',
'The Qinghai-Tibet Plateau, located in southwest China, covers an area of 2.3 million square kilometres and rises over 4,000 metres above the sea level, thus enjoying the reputation as "the world roof". The plateau boasts abundant natural resources, many rare wild animals and picturesque views. The plateau is the origin of many well-known Asian rivers which are well recognized as the major providers of fresh water for China and southeast Asian countries. Therefore, the plateau plays a key role in the global eco-system. The Chinese government has been endeavouring to conserve the eco-system here, gradually increasing the fraction of green coverage and effectively protecting many endangered species.',
'青藏高原Qinghai-Tibet Plateau,世界屋脊world roof,珍稀野生动物rare wild animals,生态系统eco-system,濒危物种endangered species',4,'2022-12'],

// === 2022年6月 三大桥梁 ===
['南京长江大桥是长江上首座由中国设计、采用国产材料建造的铁路、公路两用桥。它的建成打破了外国专家"长江南京段无法建桥"的断言，极大地鼓舞了中国人民自力更生建设国家的信心。大桥上层为公路桥，下层为双线铁路桥，将火车过江时间由靠轮渡的1.5小时缩短为2分钟。',
'The Nanjing Yangtze River Bridge is the first combined rail and road bridge on the Yangtze River that was designed by China and built with domestic materials. Its completion broke the assertion of foreign experts that "a bridge cannot be built across the Yangtze River in the Nanjing section" and greatly boosted the confidence of the Chinese people in building their country through self-reliance. The upper level is a road bridge and the lower level is a double-track railway bridge, shortening the time for trains to cross the river from 1.5 hours by ferry to 2 minutes.',
'南京长江大桥Nanjing Yangtze River Bridge,铁路公路两用桥combined rail and road bridge,国产材料domestic materials,自力更生self-reliance',3,'2022-06'],
['卢沟桥位于北京西南，是北京现存最古老的多拱石桥，始建于1192年。桥两侧各有望柱140根，柱头雕刻有大小石狮。由于其独特的建筑风格和精美的石狮雕刻，卢沟桥早已成为北京的一个重要旅游景点。卢沟桥不仅是一座桥，更是一处重要的历史遗址。1937年7月7日，卢沟桥事变在此爆发，标志着中国人民全面抗日战争的开始。',
'Located in the southwest of Beijing, the Lugou Bridge is the oldest existing multi-arch stone bridge in Beijing, first built in 1192. There are 140 balusters on each side of the bridge, with their heads carved with stone lions of various sizes. Because of its unique architectural style and exquisite stone lion carvings, the Lugou Bridge has long become an important tourist attraction in Beijing. The Lugou Bridge is not only a bridge but also an important historical site. On July 7, 1937, the Lugou Bridge Incident broke out here, marking the beginning of the Chinese people\'s full-scale War of Resistance against Japanese Aggression.',
'卢沟桥Lugou Bridge,多拱石桥multi-arch stone bridge,望柱balusters,石狮stone lions,卢沟桥事变Lugou Bridge Incident',4,'2022-06'],
['赵州桥建于隋代，由著名匠师李春设计和建造，距今已有约1400年的历史，是当今世界上现存最早、保存最完整的古代敞肩石拱桥。大桥全长50.82米，桥宽9.6米。桥的大拱两端各有两个小拱，这种设计既减轻了桥身重量，又增加了桥的美观性，而且有助于宣泄洪水。赵州桥在中国桥梁建筑史上占有重要地位。',
'The Zhaozhou Bridge was built in the Sui Dynasty, designed and constructed by the famous craftsman Li Chun, with a history of about 1,400 years. It is the earliest existing and best-preserved ancient open-spandrel stone arch bridge in the world. The bridge is 50.82 meters long and 9.6 meters wide. There are two small arches at each end of the main arch, which not only reduce the weight of the bridge and increase its aesthetic appeal, but also help discharge floodwaters. The Zhaozhou Bridge occupies an important position in the history of Chinese bridge construction.',
'赵州桥Zhaozhou Bridge,隋代Sui Dynasty,敞肩石拱桥open-spandrel stone arch bridge,减轻重量reduce weight,宣泄洪水discharge floodwaters',3,'2022-06'],

// === 2021年12月 革命圣地 ===
['延安位于陕西省北部，地处黄河中游，是中国革命的圣地。毛泽东等老一辈革命家曾在这里生活战斗了十三个春秋，领导了抗日战争和解放战争，培育了延安精神，为中国革命做出了巨大贡献。延安的革命旧址全国数量最大、分布最广、级别最高。延安有9个革命纪念馆，珍藏着大量重要物品，因此享有"中国革命博物馆城"的美誉。',
'Located in the northern part of Shaanxi Province and in the middle reaches of the Yellow River, Yan\'an is the sacred land of the Chinese Revolution. The old generation of revolutionaries such as Mao Zedong lived and fought here for thirteen years, leading the War of Resistance against Japanese Aggression and the War of Liberation, cultivating the spirit of Yan\'an, and making great contribution to the Chinese revolution. With the largest number of revolutionary sites that are distributed widest and have the highest level in the country, Yan\'an has nine revolutionary memorial halls, which hold a large number of important items, so it enjoys the reputation of the museum city of Chinese revolution.',
'延安Yan\'an,革命圣地sacred land of revolution,老一辈革命家old generation of revolutionaries,延安精神spirit of Yan\'an,革命纪念馆revolutionary memorial halls',4,'2021-12'],
['中国共产党第一次全国代表大会会址位于上海兴业路76号，是一栋典型的上海式住宅，建于1920年秋。1921年7月23日，中国共产党第一次全国代表大会在此召开，大会通过了中国共产党的第一个纲领和第一个决议，选举产生了中央领导机构，宣告了中国共产党的诞生。1952年9月，中共一大会址修复，建立纪念馆并对外开放，现已成为了解党史、缅怀革命先烈的爱国主义教育基地。',
'Situated at No.76 Xingye Road, Shanghai, the Site of the First National Congress of the Communist Party of China is a typical Shanghai-style residence built in the fall of 1920. On July 23, 1921, the First National Congress of the CPC was held here, where the first programme and resolution of the CPC were passed, and the collective central leadership was elected, thus announcing the birth of the Communist Party of China. In September 1952, the site was renovated, and a Memorial Hall was established and opened to the public, which has become a patriotic education base to know party\'s history and commemorate the memory of revolutionary martyrs.',
'中共一大会址Site of the First National Congress of CPC,纲领programme,决议resolution,纪念馆Memorial Hall,爱国主义教育基地patriotic education base',4,'2021-12'],
['井冈山地处湖南江西两省交界处，因其辉煌的革命历史被誉为"中国革命红色摇篮"。1927年10月，毛泽东、朱德等老一辈革命家率领中国工农红军来到这里，开展了艰苦卓绝的斗争，创建了第一个农村革命根据地，点燃了中国革命的星星之火，开辟了"农村包围城市，武装夺取政权"这一具有中国特色的革命道路。',
'Jinggangshan is located at the boundary of Hunan Province and Jiangxi Province, which is honored as "the red cradle of Chinese revolution" for its glorious revolutionary history. In October 1927, the old generation like Mao Zedong and Zhu De led the Chinese Workers\' and Peasants\' Army here, where they created the first rural revolutionary base with much extremely hard and bitter struggle and lit the sparks of Chinese revolution, breaking a revolutionary path with Chinese characteristic to besiege the city from the countryside and to seize power by armed force.',
'井冈山Jinggangshan,红色摇篮red cradle,农村革命根据地rural revolutionary base,星星之火sparks of revolution,农村包围城市besiege the city from the countryside',4,'2021-12'],

// === 2020年12月 基础设施 ===
['港珠澳大桥全长55公里，是我国一项不同寻常的工程壮举。大桥将三个城市连接起来，是世界上最长的跨海桥梁和隧道系统。大桥将三个城市之间的旅行时间从3小时缩短到30分钟。这座跨度巨大的钢筋混凝土大桥充分证明中国有能力建造创纪录的巨型建筑。它将助推区域一体化，促进经济增长。',
'The 55-kilometre Hong Kong-Zhuhai-Macao Bridge is an extraordinary engineering feat in our country. As the longest sea-crossing bridge and tunnel system in the world, the bridge connects the three cities, shortening the travelling time among them from 3 hours to 30 minutes. This reinforced concrete bridge with huge spans fully proves that China has the ability to build record-breaking mega-constructions. It will enhance regional integration and boost economic growth.',
'港珠澳大桥Hong Kong-Zhuhai-Macao Bridge,工程壮举engineering feat,跨海大桥sea-crossing bridge,钢筋混凝土reinforced concrete,区域一体化regional integration',4,'2020-12'],

// === 2020年9月 四大名著 ===
['《水浒传》是中国文学四大经典小说之一。这部小说基于历史人物宋江及其伙伴反抗封建帝王的故事，数百年来一直深受中国读者的喜爱。毫不夸张地说，几乎每个中国人都熟悉小说中的一些主要人物。这部小说中的精彩故事在茶馆、戏剧舞台、广播电视、电影屏幕和无数家庭中反复讲述。事实上，这部小说的影响已经远远超出了国界。',
'Water Margin is one of the four great classical novels of Chinese literature. The novel, written on the basis of the stories of the historical figures Song Jiang and his partners\' rebellion against the feudal emperor, has been popular with Chinese readers for centuries. It goes without exaggeration that almost every single Chinese has a good knowledge of some major characters in the novel as its wonderful stories are told over and over again in teahouses, on the stage in plays, on radio and television, on film screens and in countless homes. As a matter of fact, the influence of this novel has gone far beyond national boundaries.',
'水浒传Water Margin,四大经典小说four great classical novels,封建帝王feudal emperor,毫不夸张地说it goes without exaggeration,国界national boundaries',3,'2020-09'],
['《西游记》也许是中国文学四大经典小说中最具影响力的一部，当然也是在国外最广为人知的一部小说。这部小说描绘了著名僧侣玄奘在三个随从的陪同下穿越中国西部地区前往印度取经的艰难历程。虽然故事的主题基于佛教，但这部小说采用了大量中国民间故事和神话的素材，创造了各种栩栩如生的人物和动物形象。其中最著名的是孙悟空。',
'Journey to the West is perhaps the most influential of the four great classical novels of Chinese literature, and certainly the most widely known abroad. This novel depicts the arduous journey of the famous monk Xuanzang, accompanied by three followers, traveling through the western regions of China to India to obtain Buddhist scriptures. Although the theme of the story is based on Buddhism, the novel draws heavily on Chinese folk tales and myths, creating various vivid characters and animal images. The most famous among them is Sun Wukong.',
'西游记Journey to the West,玄奘Xuanzang,取经obtain Buddhist scriptures,随从followers,民间故事folk tales,神话myths,栩栩如生vivid',3,'2020-09'],
['《三国演义》写于14世纪，是中国著名的历史小说。这部小说以三国时期的历史为基础，描写了从二世纪下半叶到三世纪下半叶魏、蜀、吴之间的战争。小说描写了近千个人物和无数的历史事件。虽然这些人物和事件是有历史根据的，但它们都在不同程度上被戏剧化和扩大了。《三国演义》是公认的文学名著，对中国历史产生了广泛而深远的影响。',
'The Romance of the Three Kingdoms, which was written in the fourteenth century, is a famous historical novel in China. Based on the history of the Three Kingdoms period, this novel describes the war between Wei, Shu and Wu from the second half of the second century to the second half of the third century. It depicts nearly a thousand characters and countless historical events. Although these characters and events are based on the real history, they are dramatized and exaggerated to varying degrees. The Romance of the Three Kingdoms is widely acknowledged to be a literary masterpiece and has exerted an extensive and far-reaching influence on Chinese history.',
'三国演义Romance of the Three Kingdoms,历史小说historical novel,魏蜀吴Wei Shu Wu,戏剧化dramatized,文学名著literary masterpiece',3,'2020-07'],

// === 经典翻译补充 ===
['牡丹花色艳丽，形象高雅，象征着和平与繁荣，在中国历来被称作"花中之王"。许多城市每年都举办牡丹节，吸引大量游客前来观赏。唐代诗人曾写下许多赞美牡丹的诗歌。',
'The peony, with its bright colors and elegant image, symbolizes peace and prosperity and has always been known as the "king of flowers" in China. Many cities hold peony festivals every year, attracting large numbers of tourists to come and admire the flowers. Poets of the Tang Dynasty wrote many poems praising peonies.',
'牡丹peony,高雅elegant,繁荣prosperity,花中之王king of flowers,唐代Tang Dynasty',3,'2019-12'],
['荷花是中国的传统名花之一，它从污泥中生长出来却不受污染，象征着纯洁和高雅。荷花的花期很长，可以延续两三个月，因此深受人们喜爱。中国古代诗人写下了无数赞美荷花的诗篇。',
'The lotus is one of China\'s traditional famous flowers. It grows out of mud but remains unstained, symbolizing purity and elegance. The blooming period of lotus is quite long, lasting for two or three months, which makes it deeply loved by people. Ancient Chinese poets wrote countless poems praising the lotus.',
'荷花lotus,出淤泥而不染grows out of mud but remains unstained,纯洁purity,花期blooming period',3,'2019-12'],
['汉语是全世界母语人数最多的语言，也是联合国六种官方语言之一。汉语以方块字为书写形式，有着世界上最古老的持续使用的书写系统。随着中国经济的快速发展，学习汉语的人数正在迅速增加。',
'Chinese is the language with the largest number of native speakers in the world and one of the six official languages of the United Nations. Written in the form of square characters, Chinese has the oldest continuously used writing system in the world. With the rapid development of China\'s economy, the number of people learning Chinese is rapidly increasing.',
'汉语Chinese,母语native speakers,方块字square characters,书写系统writing system,联合国United Nations',3,'2019-06'],
['近年来，中国经济经历了快速发展，从计划经济转向市场经济。GDP的快速增长使五亿多人摆脱了贫困。与此同时，政府实施了第十二个五年规划，重点关注环境保护和人民生活质量。',
'In recent years, China\'s economy has experienced rapid development, transitioning from a planned economy to a market economy. The rapid growth of GDP has lifted more than 500 million people out of poverty. Meanwhile, the government has implemented the 12th Five-Year Plan, focusing on environmental protection and the quality of people\'s lives.',
'计划经济planned economy,市场经济market economy,脱贫lift out of poverty,五年规划Five-Year Plan',3,'2021-06'],
['中国的公共服务设施建设取得了显著进展。城市功能日益完善，基础设施体系化建设不断推进。政府通过改造老旧小区、增加绿地面积、优化公共交通等方式，为市民创造了更加宜居的生活环境。',
'China has made remarkable progress in the construction of public service facilities. Urban functions have been increasingly improved, and the systematic construction of infrastructure has been continuously advanced. The government has created a more livable environment for citizens by renovating old residential areas, increasing green space, and optimizing public transportation.',
'公共服务public service,老旧小区old residential areas,绿地green space,宜居livable',3,'2023-06'],
];

let count=0;
db.run('BEGIN');
for(const [cn,en,key,diff,year] of trans){
  iT.run([cn,en,key,diff,year]);
  count++;
}
db.run('COMMIT');
saveDb();
console.log(`Seeded ${count} real translation exercises.`);
