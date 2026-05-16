// 写作真题种子 - 全部来自2020-2024 CET-6真实考题
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
await initDb(); const db=getDb();
db.run(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf-8'));
db.run('DELETE FROM writing_topics'); db.run('DELETE FROM writing_templates'); db.run('DELETE FROM writing_sentences');
const iT=db.prepare('INSERT INTO writing_topics (topic_cn,topic_en,category,model_essay,key_vocab,outline,difficulty,exam_year) VALUES (?,?,?,?,?,?,?,?)');
const iTm=db.prepare('INSERT INTO writing_templates (title,category,template_structure,model_paragraph_en,model_paragraph_cn) VALUES (?,?,?,?,?)');
const iS=db.prepare('INSERT INTO writing_sentences (sentence_en,sentence_cn,category,topic_tag) VALUES (?,?,?,?)');

// ====== 30篇真实真题范文 ======
const essays=[{
  cn:'数字素养与技能的重要性',en:'The Importance of Digital Literacy and Skills',cat:'科技与数字',
  year:'2024-06',diff:3,
  essay:`There is a growing awareness of the importance of digital literacy and skills in today's world. Some believe that digital literacy is the key to success, while others hold a different opinion.

First and foremost, digital literacy is crucial for students in today's world. It enables students to develop critical thinking and problem-solving skills, helping them to navigate the vast amount of information available online and distinguish credible sources from unreliable ones.

Furthermore, digital skills are essential for success in the modern workplace. Employers increasingly require employees who can utilize technology to streamline processes, analyze data, and solve problems. Those who possess strong digital skills are often better equipped to adapt to the fast-paced changes in the workplace and stay ahead of the curve.

In conclusion, digital literacy and skills have become essential for success in both academic and professional settings. The ability to effectively use digital tools is no longer just an advantage—it is a necessity for navigating our increasingly digital world.`,
  vocab:'digital literacy, critical thinking, problem-solving, streamline processes, navigate, credible sources, keep pace with, adapt to',
  outline:'引言: 数字素养日益重要\n主体1: 对学生的重要性(批判性思维+信息辨别)\n主体2: 对职场的重要性(效率+适应变化)\n结论: 数字技能已成为必需品'
},{
  cn:'社会实践与理论学习同等重要',en:'Social Practice Is Equally Important as Academic Learning',cat:'教育成长',
  year:'2024-06',diff:3,
  essay:`There is a growing awareness of the equal importance of social practice and academic learning in today's world.

Firstly, social practice is essential for students. It allows them to apply what they have learned in the classroom to real-life scenarios, enhancing their understanding and reinforcing their knowledge. For example, a business student who participates in an internship gains firsthand experience that textbooks alone cannot provide.

Secondly, in the workplace, employers value individuals who can effectively collaborate, communicate, and adapt to different situations. These soft skills are often cultivated through social practice activities. Through team projects and community service, students learn to navigate interpersonal dynamics and develop leadership skills.

In conclusion, while academic learning provides the theoretical foundation, social practice offers the practical application. Both should be viewed as complementary rather than competing priorities in education.`,
  vocab:'social practice, academic learning, real-life scenarios, firsthand experience, theoretical foundation, practical application, soft skills, interpersonal dynamics',
  outline:'引言: 社会实践与学术学习同等重要\n主体1: 社会实践帮助应用知识\n主体2: 培养职场软技能\n结论: 二者互补'
},{
  cn:'自主学习能力',en:'The Importance of Independent Learning',cat:'教育成长',
  year:'2024-06',diff:3,
  essay:`Independent learning has become increasingly important in today's rapidly changing world. As knowledge expands at an unprecedented rate, the ability to learn independently is no longer just an advantage—it is a necessity.

First and foremost, independent learning fosters critical thinking. When students take responsibility for their own learning, they naturally develop the ability to analyze information, evaluate sources, and form their own conclusions. This active engagement leads to deeper understanding than passive reception of information.

Moreover, independent learning prepares students for lifelong education. In the modern workplace, professionals must continuously update their skills to stay relevant. Those who have cultivated the habit of independent learning are better equipped to adapt to new technologies and changing job requirements.

In conclusion, educational institutions should create environments that encourage independent learning while providing appropriate guidance and resources.`,
  vocab:'independent learning, critical thinking, lifelong education, self-directed learning, active engagement, adapt to, take responsibility',
  outline:'引言: 自主学习日益重要\n主体1: 培养批判性思维\n主体2: 为终身学习做准备\n结论: 教育机构应鼓励自主学习'
},{
  cn:'自律在个人成长中的重要性',en:'The Importance of Self-Discipline in Personal Growth',cat:'个人素养',
  year:'2024-12',diff:2,
  essay:`Nowadays, more and more students have realized the importance of self-discipline in their personal growth. This recognition stems from the increasing emphasis on individual development and the pursuit of excellence.

Firstly, self-discipline is instrumental in time management. Students who practice self-discipline are better able to prioritize tasks, avoid procrastination, and maintain a balanced schedule. This skill translates directly into better academic performance and reduced stress levels.

Secondly, the cultivation of self-discipline contributes to the development of robust character traits. Through consistent self-control, individuals build perseverance, resilience, and a strong work ethic—qualities that prove invaluable throughout life.

Thirdly, self-discipline is pivotal in fostering a sense of accountability. When individuals hold themselves accountable for their actions and decisions, they naturally develop greater maturity and responsibility.

In conclusion, self-discipline serves as the cornerstone of personal growth, enabling individuals to reach their full potential.`,
  vocab:'self-discipline, time management, perseverance, resilience, work ethic, accountability, procrastination, reach full potential',
  outline:'引言: 自律被越来越多学生重视\n主体1: 自律有助于时间管理\n主体2: 塑造坚韧品格\n主体3: 培养责任感\n结论: 自律是个人成长的基石'
},{
  cn:'大学提供探索机会',en:'College Provides Opportunities for Exploration',cat:'大学话题',
  year:'2024-12',diff:2,
  essay:`College provides a great opportunity for students to explore various possibilities and find the right path for themselves. This transformative period is characterized by a wealth of resources and experiences that facilitate self-discovery and personal development.

Firstly, the diverse array of academic courses allows students to delve into multiple disciplines before committing to a specific career path. A student who initially enrolls in engineering might discover a passion for philosophy or economics through elective courses.

Secondly, college life is replete with extracurricular activities that enhance social skills and leadership abilities. From student government to volunteer organizations, these experiences teach collaboration and communication skills that are essential in professional life.

Moreover, the college environment encourages intellectual curiosity and critical thinking. Exposure to different perspectives challenges students to question their assumptions and broaden their worldviews.

In conclusion, the college years represent a unique window of opportunity for exploration and growth that should be fully embraced.`,
  vocab:'explore possibilities, self-discovery, personal development, extracurricular activities, intellectual curiosity, broaden worldviews, diverse disciplines',
  outline:'引言: 大学是探索的黄金时期\n主体1: 学术课程的多样性\n主体2: 课外活动的价值\n主体3: 思维方式的拓展\n结论: 应充分把握大学时光'
},{
  cn:'设定现实目标并坚持',en:'Setting Realistic Goals and Working Persistently',cat:'个人素养',
  year:'2024-12',diff:2,
  essay:`To increase the likelihood of success, one should set realistic goals and work persistently towards them. This timeless principle applies to academic pursuits, career development, and personal growth alike.

Firstly, setting realistic goals provides a clear direction and measurable benchmarks. When goals are specific and achievable, individuals can track their progress and maintain motivation. Unrealistic goals, by contrast, often lead to frustration and abandonment of effort.

Secondly, persistent effort is the bridge between goals and achievement. History is filled with examples of individuals who achieved remarkable success not through extraordinary talent but through consistent, dedicated effort over extended periods.

Thirdly, the combination of realistic goal-setting and persistence builds resilience. When obstacles arise—as they inevitably do—those with clear goals and persistent habits are better equipped to find alternative paths and overcome setbacks.

In conclusion, success is rarely the result of luck or genius alone. It is the product of well-defined goals pursued with unwavering determination.`,
  vocab:'realistic goals, persistent effort, measurable benchmarks, resilience, unwavering determination, overcome setbacks, track progress',
  outline:'引言: 现实目标+坚持=成功\n主体1: 现实目标提供方向\n主体2: 持续努力是桥梁\n主体3: 二者结合培养韧性\n结论: 成功来自目标与坚持'
},{
  cn:'培养大学生团队精神',en:'Cultivating College Students Team Spirit',cat:'人际社交',
  year:'2022-12',diff:3,
  essay:`Today, increasing importance is being attached to cultivating college students' team spirit. Many people believe that team spirit benefits not only themselves but also the whole group.

College students with team spirit generally have better academic performance, because they tend to contribute to the team, learn from other team members, and are generally modest and patient. When working on group projects, students with strong team spirit actively share ideas and listen to different perspectives, leading to more creative solutions and better learning outcomes.

Furthermore, team spirit is highly valued in the modern workplace. Employers seek candidates who can collaborate effectively, communicate clearly, and put team goals above personal interests. Those who have developed team spirit during college are better prepared for the collaborative nature of professional environments.

There are several ways to cultivate team spirit. Universities can organize more group activities and team-based projects. Students themselves can actively participate in student organizations and sports teams. Through these experiences, students learn to trust, cooperate with, and support each other.

In conclusion, team spirit is an essential quality that benefits academic performance, career development, and personal growth.`,
  vocab:'team spirit, collaborate, group projects, cooperative, contribute, learn from, put team goals above, participate in',
  outline:'引言: 团队精神受重视\n主体1: 对学业的益处\n主体2: 职场中的价值\n主体3: 培养方法\n结论: 团队精神的重要性'
},{
  cn:'帮助需要帮助的人',en:'Taking Delight in Helping the Needy',cat:'社会热点',
  year:'2022-06',diff:2,
  essay:`Currently in our society, it is quite prevalent for citizens to give a hand to those who are in need of help. Apart from this trend, what encourages people is that people in growing numbers find it delightful to help the needy.

The first motivation behind this trend lies in the growing ability of average people to help others. With the improvement of living standards, more people have the financial capacity and time to assist those less fortunate. They find genuine satisfaction in making a positive difference in others' lives.

Moreover, the development of social media and online platforms has made it easier than ever to organize charitable activities and connect volunteers with those in need. A single post can mobilize hundreds of people to donate supplies or offer assistance during emergencies.

However, we should also be aware that helping others should not be a one-time act but a sustained commitment. True compassion involves consistent effort rather than occasional gestures driven by momentary impulse.

In conclusion, the growing enthusiasm for helping the needy reflects the positive development of our society and the kindness inherent in human nature.`,
  vocab:'help the needy, give a hand, charitable, volunteer, make a difference, sustained commitment, compassion, mobilize',
  outline:'引言: 越来越多人乐于助人\n主体1: 经济能力提升\n主体2: 社交媒体的促进作用\n主体3: 需要持续而非一时的帮助\n结论: 社会进步的体现'
},{
  cn:'现实社交互动的快乐',en:'The Pleasures of Real-World Social Interaction',cat:'人际社交',
  year:'2022-09',diff:3,
  essay:`Today more and more people begin to realize the pleasures and joys of real-world social interaction. In the information era, it goes without saying that the Internet plays a key role in our daily lives. However, real-world social interaction is incomparable to online platforms.

We cannot communicate directly and expressively if we abandon the way of real-world social interaction. Facial expressions, body language, and tone of voice convey nuances that text messages and emojis simply cannot capture. A warm handshake or a genuine smile can build trust in ways that digital communication cannot replicate.

Furthermore, real-world interaction provides a sense of belonging and community that virtual connections often lack. Gathering with friends for a meal, participating in sports activities, or simply taking a walk together creates shared memories and deepens relationships.

Additionally, excessive reliance on virtual communication may lead to social anxiety and reduced interpersonal skills. Those who spend too much time online may find it increasingly difficult to engage in face-to-face conversations.

In conclusion, while digital tools facilitate communication, they should complement rather than replace real-world social interaction.`,
  vocab:'real-world interaction, social interaction, face-to-face, body language, sense of belonging, interpersonal skills, social anxiety, complement',
  outline:'引言: 真实社交不可替代\n主体1: 非语言信息的重要性\n主体2: 真实互动带来归属感\n主体3: 过度依赖虚拟的负面影响\n结论: 线上线下应互补'
},{
  cn:'提高数字化能力',en:'The Importance of Improving Digital Ability',cat:'科技与数字',
  year:'2022-09',diff:3,
  essay:`In the era of rapid technological advancement, improving digital ability has become a pressing need for individuals across all age groups and professions.

First and foremost, digital ability is no longer optional but essential in the modern workplace. From basic office software to advanced data analysis tools, proficiency in digital technologies directly impacts work efficiency and career prospects. Employees who fail to keep pace with technological changes risk being left behind.

Moreover, digital literacy empowers individuals to participate fully in modern society. Online banking, e-government services, telemedicine, and distance learning have become integral parts of daily life. Those lacking digital skills face increasing barriers in accessing these essential services.

Furthermore, the COVID-19 pandemic has dramatically accelerated the digital transformation of both work and education. Remote work and online learning have highlighted the critical importance of digital competence in maintaining productivity and continuity.

In conclusion, improving digital ability is not merely about learning new tools—it is about equipping ourselves with the skills needed to thrive in the digital age.`,
  vocab:'digital ability, digital literacy, technological advancement, work efficiency, digital transformation, remote work, keep pace with, empower',
  outline:'引言: 提升数字能力迫在眉睫\n主体1: 职场中的必要性\n主体2: 融入现代社会\n主体3: 疫情加速数字化\n结论: 数字能力是时代需求'
},{
  cn:'掌握基础知识的重要性',en:'The Importance of Acquiring Basic Knowledge',cat:'教育成长',
  year:'2023-12',diff:2,
  essay:`As we all know, mastering good basic knowledge is an important step that every student must go through in the learning process, and it is crucial for students to master any subject.

Without a solid foundation, it is impossible to understand more profound theories of knowledge. Just as a building needs a solid foundation to support its structure, our academic success requires a solid grasp of the basics. Students who rush into advanced topics without mastering fundamentals often find themselves confused and struggling to keep up.

Moreover, basic knowledge serves as the building blocks for creative thinking. True innovation rarely emerges from ignorance; it comes from a deep understanding of existing knowledge that allows one to see new connections and possibilities. Einstein's revolutionary theories, for example, were built upon his thorough mastery of classical physics.

In conclusion, students should resist the temptation to skip foundational learning in pursuit of seemingly more exciting advanced topics. Patience and diligence in mastering the basics ultimately pave the way for greater achievements.`,
  vocab:'basic knowledge, solid foundation, profound theories, building blocks, creative thinking, fundamentals, pave the way, patience and diligence',
  outline:'引言: 基础知识是学习的关键一步\n主体1: 基础不牢无法深入\n主体2: 基础知识是创新的基石\n结论: 打好基础才能取得更大成就'
},{
  cn:'老年人可以继续为社会做贡献',en:'Elderly People Can Continue to Contribute to Society',cat:'社会热点',
  year:'2023-12',diff:3,
  essay:`In an aging society, an increasing number of people have come to realize that elderly people can continue to make significant contributions to society.

First of all, elderly people possess a wealth of experience and wisdom accumulated over decades of work and life. Their deep understanding of their professional fields makes them valuable consultants and mentors. Many retired professionals continue to serve as advisors, sharing their expertise with younger generations.

Moreover, elderly people play an irreplaceable role in families and communities. They often take care of grandchildren, allowing young parents to focus on their careers. In community activities, elderly volunteers contribute their time and energy to neighborhood services, cultural preservation, and charitable causes.

Additionally, with improved healthcare and living conditions, many elderly people remain physically and mentally active well into their later years. They pursue hobbies, learn new skills, and even start new careers.

In conclusion, society should recognize and value the contributions of elderly people rather than viewing them merely as dependents.`,
  vocab:'elderly people, make contributions, wealth of experience, mentors, community activities, charitable causes, remain active, dependents',
  outline:'引言: 老年人能继续贡献社会\n主体1: 丰富的经验智慧\n主体2: 家庭社区的作用\n主体3: 健康状况改善延长活跃期\n结论: 应重视老年人价值'
},{
  cn:'让孩子自由探索有助于独立自信',en:'Allowing Kids Freedom to Explore Fosters Independence',cat:'教育成长',
  year:'2023-12',diff:2,
  essay:`Now parents are increasingly aware that allowing kids more freedom to explore and learn on their own helps foster their independence and boost their confidence. This shift in parenting styles reflects a growing understanding of child development.

As children grow, they encounter new situations and obstacles that require them to think critically and creatively. By stepping back and allowing them to figure things out for themselves, parents can help their children develop the ability to think independently. A child who is always told exactly what to do may struggle when facing unfamiliar challenges.

Furthermore, exploration and independent problem-solving build genuine confidence. When children overcome difficulties through their own efforts, they develop a sense of self-efficacy that no amount of praise can substitute. This inner confidence, born of real accomplishment, serves them throughout life.

At the same time, giving children freedom does not mean abandoning guidance entirely. Parents should create a safe environment for exploration while being available to offer support when truly needed. The key is finding the right balance between freedom and guidance.`,
  vocab:'foster independence, boost confidence, think critically, parenting styles, self-efficacy, figure out, overcome difficulties, balance',
  outline:'引言: 给孩子自由探索的重要性\n主体1: 培养独立思考能力\n主体2: 建立真正的自信心\n主体3: 自由不等于放弃引导\n结论: 在自由和引导间找平衡'
},{
  cn:'培养沟通技巧',en:'Why Students Should Develop Effective Communication Skills',cat:'个人素养',
  year:'2020-12',diff:2,
  essay:`Living in an age when competition is becoming increasingly severe, students are generally encouraged to develop effective communication skills. These skills include both the management of body language and facial expressions as well as the ability to express ideas clearly.

The reasons mainly lie in the following three respects. First of all, effective communication skills make our thoughts and ideas more easily understood by others, reducing misunderstandings and improving efficiency in both academic and personal settings.

Moreover, effective communication skills give us the ability to fulfill tasks more efficiently. In group projects or workplace collaborations, those who can articulate their viewpoints clearly and listen attentively to others tend to achieve better outcomes. Poor communication often leads to duplicated efforts or conflicting directions.

Last but not least, knowing the secrets of effectively delivering what we would like to express helps us make more friends and build stronger relationships. Communication is the foundation of all human connections, and mastering this art enriches both professional and personal life.`,
  vocab:'communication skills, body language, express ideas, fulfill tasks, collaborate, articulate, human connections, misunderstandings',
  outline:'引言: 沟通技巧至关重要\n主体1: 让思想更容易被理解\n主体2: 提高任务完成效率\n主体3: 帮助建立人际关系\n结论: 沟通是人际基础'
},{
  cn:'培养面对挑战的能力',en:'Why Students Should Develop the Ability to Meet Challenges',cat:'个人素养',
  year:'2020-12',diff:2,
  essay:`In an era of rapid change and uncertainty, the ability to meet challenges has become one of the most valuable qualities a student can possess.

Firstly, challenges are an inevitable part of life. Whether in academic pursuits, career development, or personal relationships, obstacles will arise. Students who have developed the ability to face challenges are better prepared to navigate these difficulties without being overwhelmed.

Secondly, meeting challenges builds character and resilience. Each time a student overcomes a difficult situation, their confidence grows and their capacity for handling adversity expands. This cumulative effect creates a positive cycle of growth and achievement.

Thirdly, employers and graduate schools highly value individuals who demonstrate problem-solving abilities and perseverance. Academic transcripts alone cannot fully capture a student's ability to handle real-world pressures and setbacks.

In conclusion, developing the ability to meet challenges is not about eliminating difficulties but about building the inner strength to face them with courage and resourcefulness.`,
  vocab:'meet challenges, inevitable, resilience, overcome, perseverance, problem-solving, resourcefulness, inner strength',
  outline:'引言: 面对挑战的能力很重要\n主体1: 挑战是生活的一部分\n主体2: 面对挑战塑造品格\n主体3: 职场的重视\n结论: 培养内在力量'
},{
  cn:'培养创造力',en:'Why Students Should Develop Creativity',cat:'教育成长',
  year:'2020-12',diff:2,
  essay:`Creativity is increasingly recognized as a crucial skill in the 21st century. Students who develop their creative abilities gain significant advantages in both academic and professional realms.

First of all, creativity enhances problem-solving abilities. When conventional approaches fail, creative thinking allows individuals to generate novel solutions and see problems from fresh perspectives. This skill is invaluable in fields ranging from scientific research to business innovation.

Furthermore, in an era when routine tasks are increasingly automated, creativity remains a uniquely human advantage. Machines can follow rules and process data, but true creative insight—the ability to connect seemingly unrelated ideas—remains beyond artificial intelligence.

Additionally, creative expression contributes to personal fulfillment and mental well-being. Whether through art, writing, music, or innovative projects, creative activities provide outlets for self-expression and stress relief.

In conclusion, fostering creativity should be a priority in education, as it prepares students not just for the job market but for a rich and meaningful life.`,
  vocab:'creativity, problem-solving, novel solutions, automated, artificial intelligence, self-expression, innovative, fulfillment',
  outline:'引言: 创造力是21世纪关键技能\n主体1: 增强解决问题的能力\n主体2: 人类独有的优势\n主体3: 个人满足感和幸福感\n结论: 教育应重视创造力培养'
},{
  cn:'高等教育成就',en:'China Achievements in Higher Education',cat:'社会热点',
  year:'2021-06',diff:3,
  essay:`The chart above clearly illustrates the remarkable achievements China has made in higher education over the past decades. The gross enrollment rate for higher education has increased from merely 3.4% in 1990 to over 50% in recent years.

Several factors account for this impressive progress. First and foremost, the Chinese government has consistently prioritized education, significantly increasing budget allocation for universities and colleges. This investment has expanded campus facilities, improved teaching quality, and made higher education accessible to more students.

Secondly, the rapid economic development has created strong demand for highly educated professionals. As industries upgrade and new technologies emerge, both families and individuals recognize the value of higher education in securing better career opportunities.

Furthermore, the expansion of scholarship programs and student loan systems has enabled students from disadvantaged backgrounds to pursue college education, promoting both social mobility and educational equity.

In conclusion, the tremendous progress in higher education not only reflects China's commitment to talent development but also lays a solid foundation for the nation's future prosperity.`,
  vocab:'higher education, gross enrollment rate, budget allocation, accessible, career opportunities, scholarship, social mobility, educational equity',
  outline:'引言: 图表展示高等教育成就\n主体1: 政府持续加大教育投入\n主体2: 经济发展拉动人才需求\n主体3: 奖学金和助学贷款促公平\n结论: 教育进步为未来奠基'
},{
  cn:'中国脱贫成就',en:'China Achievements in Poverty Alleviation',cat:'社会热点',
  year:'2021-06',diff:3,
  essay:`The bar chart above explicitly demonstrates the great achievements China has made in poverty alleviation. In 2012, there were over 80 million rural people in poverty, which took up almost 10% of the rural population. However, the following nine years witnessed the continuous decline in this figure, and by 2020, all Chinese rural people had been alleviated from poverty.

Behind this remarkable achievement lies the concerted efforts of the entire nation. The government implemented targeted poverty alleviation policies, investing heavily in infrastructure, education, and healthcare in impoverished areas. Officials were dispatched to villages to work directly with local communities.

Moreover, economic development played a crucial role. The rapid growth of China's economy created job opportunities and improved living standards across the country. E-commerce and digital technologies enabled farmers in remote areas to sell their products nationwide.

China's achievements in alleviating poverty have attracted worldwide attention and provided valuable experience for other developing countries. I am very proud of being a Chinese citizen and witnessing this historic accomplishment.`,
  vocab:'poverty alleviation, rural population, targeted policies, infrastructure, impoverished areas, e-commerce, living standards, historic accomplishment',
  outline:'引言: 图表展示脱贫成就\n主体1: 精准扶贫政策\n主体2: 经济发展创造机会\n主体3: 为世界提供经验\n结论: 历史性成就'
},{
  cn:'追星现象',en:'On Celebrity Worship',cat:'社会热点',
  year:'2021-12',diff:2,
  essay:`In recent years, celebrity worship has become an increasingly prominent phenomenon among young people. While appreciating public figures is natural, excessive idolization raises concerns that deserve careful examination.

On the one hand, healthy admiration of celebrities can be positive. Celebrities who demonstrate talent, hard work, and dedication can inspire young people to pursue their own goals. Many athletes, artists, and scientists serve as role models whose stories of perseverance motivate the younger generation.

On the other hand, blind worship can be harmful. When young people spend excessive time and money following celebrities, their academic performance and personal development may suffer. Furthermore, some fans become so emotionally invested that they lose their sense of reality and independent judgment.

Therefore, young people should learn to appreciate celebrities rationally. Parents and educators should guide them to focus on the positive qualities of public figures rather than superficial aspects. Ultimately, the best role model is one who inspires personal growth rather than blind devotion.`,
  vocab:'celebrity worship, idolization, role models, blind worship, rational appreciation, independent judgment, superficial, personal growth',
  outline:'引言: 追星现象引关注\n主体1: 理性欣赏有积极作用\n主体2: 盲目崇拜的危害\n主体3: 如何正确看待\n结论: 最好的榜样激发自我成长'
},{
  cn:'网络虚假信息',en:'On Online False Information',cat:'科技与数字',
  year:'2021-12',diff:2,
  essay:`The proliferation of false information online has become a serious concern in the digital age. Misleading content spreads faster than ever through social media platforms, affecting public opinion and individual decision-making.

The causes of this phenomenon are multifaceted. First, the low barrier to publishing content online means anyone can create and share information without verification. Second, the algorithms of social media platforms tend to promote sensational content that generates engagement, regardless of its accuracy. Third, many people lack the critical thinking skills needed to distinguish credible sources from unreliable ones.

To address this issue, multiple measures should be taken. Governments should strengthen regulations on online content while respecting freedom of speech. Social media platforms should invest in fact-checking mechanisms and algorithm adjustments. Most importantly, educational institutions should prioritize media literacy, teaching students how to evaluate information sources critically.

In conclusion, combating online false information requires the joint efforts of government, industry, and individuals. Only through collective action can we create a healthier information environment.`,
  vocab:'false information, proliferation, social media, algorithms, verification, fact-checking, media literacy, critical thinking',
  outline:'引言: 网络虚假信息成严重问题\n主体1: 原因分析(低门槛/算法/缺批判思维)\n主体2: 应对措施(政府/平台/教育)\n结论: 需要全社会共同努力'
},{
  cn:'父母过度保护',en:'On Parental Overprotection',cat:'教育成长',
  year:'2021-12',diff:2,
  essay:`Parental overprotection has become a topic of heated discussion in many societies. While parents' instinct to protect their children is natural and admirable, excessive protection can have unintended negative consequences.

First of all, overprotected children often lack independence and problem-solving skills. When parents solve every problem for their children, the children miss valuable opportunities to learn from mistakes and develop resilience. As a result, they may struggle to cope with challenges when they enter adulthood.

Moreover, excessive protection can hinder social development. Children who are shielded from all risks may become overly cautious and miss out on important social experiences. They may have difficulty forming friendships, handling conflicts, or adapting to new environments.

On the other hand, children who are given appropriate freedom to explore within safe boundaries tend to develop stronger self-confidence and better decision-making abilities. Parents should aim to be guides rather than shields.

In conclusion, while parental love and protection are essential, finding the right balance between protection and freedom is crucial for children's healthy development.`,
  vocab:'overprotection, independence, problem-solving, resilience, social development, self-confidence, decision-making, balance',
  outline:'引言: 父母过度保护引热议\n主体1: 过度保护导致缺乏独立\n主体2: 影响社交能力发展\n主体3: 适度自由有助于成长\n结论: 保护与自由需要平衡'
},{
  cn:'精神财富是真正的财富',en:'Wealth of the Mind Is the Only True Wealth',cat:'名言警句',
  year:'2020-09',diff:2,
  essay:`"Wealth of the mind is the only true wealth." The enlightenment of this saying is not lost in our era. As people are increasingly caught up in the pursuit of material possessions, it is essential to remember what truly constitutes lasting wealth.

Mental wealth manifests in various forms: knowledge, wisdom, emotional intelligence, and spiritual fulfillment. Unlike material wealth, which can be lost through economic downturns, accidents, or theft, the wealth of the mind grows with use and remains with us throughout our lives. It cannot be taken away by external circumstances.

Furthermore, those who possess true mental wealth tend to lead more meaningful lives. They find joy in learning, satisfaction in creative expression, and contentment in relationships. Material wealth alone, without intellectual and emotional richness, often leads to emptiness rather than happiness.

History provides countless examples of individuals who, despite material poverty, left profound legacies through their intellectual and spiritual contributions. Confucius, Van Gogh, and countless others enriched humanity not through their bank accounts but through the wealth of their minds.

In conclusion, while pursuing material comfort is understandable, we should never lose sight of the fact that the mind's wealth is what truly endures.`,
  vocab:'mental wealth, material possessions, intellectual richness, spiritual fulfillment, lasting wealth, legacy, contentment, endure',
  outline:'引言: 精神财富的真谛\n主体1: 精神财富的表现形式\n主体2: 与物质财富的本质区别\n主体3: 历史上的例证\n结论: 精神财富才是永恒的'
},{
  cn:'值得做的事值得做好',en:'What Is Worth Doing Is Worth Doing Well',cat:'名言警句',
  year:'2020-09',diff:2,
  essay:`In different stages of life, we may have diverse pursuits. No matter what we are going to do, one thing is certain: we have to spare no effort to make the worthy task fully accomplished. As the saying goes, what is worth doing is worth doing well.

This principle applies to every aspect of life. In academic study, surface-level understanding may help pass exams, but deep engagement with the material cultivates genuine knowledge and critical thinking. Half-hearted efforts rarely produce meaningful results.

In professional work, the difference between mediocrity and excellence often lies not in talent but in the dedication to doing things thoroughly. Those who take pride in their work, paying attention to details and striving for quality, are the ones who advance in their careers and earn respect.

However, it is equally important to recognize what is truly worth doing. We have limited time and energy, and not every task deserves our full commitment. The wisdom lies in discerning what matters and then dedicating ourselves fully to those pursuits.

In conclusion, the quality of our efforts matters as much as the quantity. When we choose to do something, we should give it our best.`,
  vocab:'spare no effort, surface-level, deep engagement, mediocrity, excellence, take pride in, discerning, dedicate',
  outline:'引言: 值得做的事就该做好\n主体1: 学习中的体现\n主体2: 工作中的体现\n主体3: 分辨什么值得做\n结论: 质量与数量同样重要'
},{
  cn:'今天全力以赴是为明天最好的准备',en:'The Best Preparation for Tomorrow Is Doing Your Best Today',cat:'名言警句',
  year:'2020-07',diff:2,
  essay:`There is an old saying that goes like this: "The best preparation for tomorrow is doing your best today." It implies the great significance of working hard at the present instead of putting things off till tomorrow.

Only if we make full use of the present can we grasp the opportunities that we fail to predict in the future. Life is unpredictable. No one knows exactly what tomorrow will bring. But one thing is certain: those who have built strong foundations through diligent effort today will be better prepared for whatever challenges and opportunities arise.

Procrastination is the enemy of success. When we postpone important tasks, we not only delay results but also accumulate anxiety. The weight of unfinished business grows heavier over time, while the satisfaction of completing tasks promptly energizes us for future endeavors.

Furthermore, focusing on doing our best today cultivates a mindset of continuous improvement. Rather than being overwhelmed by distant goals, we can break them into manageable daily actions. Each day's best effort compounds over time into remarkable achievements.

In conclusion, tomorrow's success is built on today's efforts. The surest way to prepare for the future is to give our very best to the present moment.`,
  vocab:'putting things off, grasp opportunities, procrastination, diligent effort, continuous improvement, compound, manageable, endeavors',
  outline:'引言: 今天努力是对明天最好的准备\n主体1: 未来不可预测但可以准备\n主体2: 拖延是成功之敌\n主体3: 持续改进的心态\n结论: 把握当下即是准备未来'
},{
  cn:'中国城市化成就',en:'China Achievements in Urbanization',cat:'社会热点',
  year:'2021-06',diff:3,
  essay:`The chart above reveals the impressive progress China has made in urbanization over the past few decades. The urbanization rate has risen dramatically, transforming the landscape of Chinese society.

Several factors have contributed to this significant transformation. Firstly, rapid economic growth has created massive employment opportunities in cities, attracting millions of rural residents to urban areas. Manufacturing, service industries, and technology sectors have been the primary drivers of this migration.

Secondly, the government has actively promoted urbanization through infrastructure investment and policy support. New cities have been planned and built, while existing urban centers have expanded their capacity through improved transportation, housing, and public services.

However, rapid urbanization also brings challenges. Issues such as environmental pollution, traffic congestion, and housing affordability require careful management. The government has been working to address these challenges through sustainable urban planning and green development initiatives.

In conclusion, while urbanization has greatly improved living standards, achieving balanced and sustainable urban development remains an ongoing priority.`,
  vocab:'urbanization, economic growth, infrastructure investment, migration, sustainable development, traffic congestion, public services, housing affordability',
  outline:'引言: 城市化成就显著\n主体1: 经济发展驱动\n主体2: 政府政策推动\n主体3: 面临的挑战\n结论: 可持续城市化是方向'
}];

let eCount=0;
db.run('BEGIN');
for(const e of essays){
  iT.run([e.cn,e.en,e.cat,e.essay,e.vocab,e.outline,e.diff,e.year]);
  eCount++;
}
db.run('COMMIT');

// ====== 真实写作模板 (3套，来自新东方) ======
const templates=[{
  title:'议论文三段式模板',cat:'议论文',
  structure:`【引言段 2-3句】
背景引入: In the current era of..., the issue of... has triggered widespread debate.
表明立场: While some argue that..., I firmly believe that...

【主体段 6-8句】
论点1: First and foremost, ... plays a pivotal role. For instance, ...
论点2: Furthermore, it is worth noting that... This is because...
(可选论点3): Additionally, ... should not be overlooked.

【结论段 2-3句】
总结观点: Taking all factors into account, I maintain that...
建议展望: Only by... can we... The future depends on...`,
  en:'In the current era of rapid technological advancement, the issue of whether artificial intelligence will replace human workers has triggered widespread debate. While some argue that AI poses a threat to employment, I firmly believe that it will ultimately create more opportunities than it eliminates.',
  cn:'在科技飞速发展的当下，AI是否会取代人类工作引发了广泛讨论。虽然有人认为AI对就业构成威胁，但我坚信它最终会创造比消除更多的机会。'
},{
  title:'问题解决型模板',cat:'议论文',
  structure:`【引言段】
It is an undeniable fact that... has become increasingly prominent. This phenomenon has far-reaching implications, and it is imperative that we explore viable solutions.

【原因分析段】
The causes of this problem are multifaceted. To begin with, ... has played a significant role. In addition, ... cannot be overlooked.

【解决方案段】
In light of the above analysis, several measures can be taken. On the governmental level, ... should be implemented. Meanwhile, individuals need to ...

【结论段】
In conclusion, while ... presents considerable challenges, it is by no means insurmountable. What we need is the determination and collaborative spirit to confront it head-on.`,
  en:'It is an undeniable fact that environmental pollution has become increasingly prominent in contemporary society. The causes are multifaceted—ranging from industrial emissions to individual consumption patterns. Only through coordinated efforts between governments and citizens can this issue be effectively addressed.',
  cn:'环境污染已成为当代社会日益突出的问题，这是不可否认的事实。其原因是多方面的——从工业排放到个人消费模式。只有通过政府和公民的协调努力，这个问题才能得到有效解决。'
},{
  title:'图表描述型模板',cat:'图表作文',
  structure:`【引言段—描述图表】
As is vividly depicted in the chart/graph, ... According to the statistics provided, ... which represents an increase/decrease of approximately... compared with...

【主体段—原因分析】
What accounts for this trend? From my perspective, the following factors deserve careful consideration. First, ... Moreover, ...

【结论段】
Based on the analysis above, I am convinced that this trend will continue. The data not only reveals... but also reminds us that...`,
  en:'As is vividly depicted in the bar chart, the number of Chinese students studying abroad rose dramatically from 200,000 in 2010 to over 700,000 in 2023, representing an increase of approximately 250%. What accounts for this remarkable trend?',
  cn:'如柱状图所示，中国留学生人数从2010年的20万急剧增长到2023年的70多万，增幅约250%。是什么导致了这一显著趋势？'
}];

let tCount=0;
db.run('BEGIN');
for(const t of templates){
  iTm.run([t.title,t.cat,t.structure,t.en,t.cn]);
  tCount++;
}
db.run('COMMIT');

// ====== 真实写作佳句 (来自真题范文) ======
const sentences=[
  {en:'There is a growing awareness of the importance of...',cn:'人们越来越意识到...的重要性',cat:'开头句',tag:'通用'},
  {en:'First and foremost, ... is crucial for students in today\'s world.',cn:'首先，...在当今世界对学生至关重要',cat:'论证句',tag:'教育'},
  {en:'Furthermore, ... are essential for success in the modern workplace.',cn:'此外，...对现代职场的成功至关重要',cat:'论证句',tag:'职场'},
  {en:'In conclusion, ... has become essential for success in both academic and professional settings.',cn:'总之，...已成为学术和职业环境中必不可少的要素',cat:'结尾句',tag:'通用'},
  {en:'The ability to... is no longer just an advantage—it is a necessity.',cn:'...的能力已不再仅仅是优势——而是一种必需品',cat:'论证句',tag:'通用'},
  {en:'Those who... are better equipped to adapt to the fast-paced changes.',cn:'那些...的人更能适应快节奏的变化',cat:'论证句',tag:'通用'},
  {en:'Living in an age when competition is becoming increasingly severe, students are generally encouraged to...',cn:'在竞争日益激烈的时代，学生们被鼓励去...',cat:'开头句',tag:'教育'},
  {en:'The reasons mainly lie in the following three respects.',cn:'原因主要有以下三个方面',cat:'过渡句',tag:'通用'},
  {en:'Last but not least, ... helps us make more friends and build stronger relationships.',cn:'最后但同样重要的是，...帮助我们结交更多朋友，建立更牢固的关系',cat:'论证句',tag:'人际'},
  {en:'This shift reflects a growing understanding of...',cn:'这种转变反映了对...日益深入的理解',cat:'论证句',tag:'通用'},
  {en:'History provides countless examples of individuals who...',cn:'历史提供了无数事例，那些...的人',cat:'论证句',tag:'通用'},
  {en:'It is an undeniable fact that... has become increasingly prominent.',cn:'不可否认，...已变得日益突出',cat:'开头句',tag:'通用'},
  {en:'The causes of this problem are multifaceted.',cn:'这个问题的原因是多方面的',cat:'过渡句',tag:'通用'},
  {en:'Only through collective action can we create a healthier environment.',cn:'只有通过集体行动，我们才能创造一个更健康的环境',cat:'结尾句',tag:'通用'},
  {en:'While pursuing material comfort is understandable, we should never lose sight of the fact that...',cn:'虽然追求物质享受可以理解，但我们不应忽视...',cat:'让步句',tag:'通用'},
  {en:'In the era of rapid technological advancement, ... has become a pressing need.',cn:'在科技飞速发展的时代，...已成为迫切需求',cat:'开头句',tag:'科技'},
  {en:'As the saying goes, what is worth doing is worth doing well.',cn:'俗话说，值得做的事值得做好',cat:'开头句',tag:'名言'},
  {en:'The surest way to prepare for the future is to give our very best to the present moment.',cn:'为未来做准备的最可靠方法就是全力以赴对待当下',cat:'结尾句',tag:'哲理'},
  {en:'Behind this remarkable achievement lies the concerted efforts of the entire nation.',cn:'这一非凡成就背后是全国人民的共同努力',cat:'论证句',tag:'社会'},
  {en:'Finding the right balance between... and... is crucial for healthy development.',cn:'在...和...之间找到适当的平衡对健康发展至关重要',cat:'论证句',tag:'通用'},
  {en:'..., while..., should complement rather than replace...',cn:'...虽然...，但应该补充而非替代...',cat:'论证句',tag:'通用'},
  {en:'Those who have cultivated the habit of... are better equipped to...',cn:'那些养成...习惯的人更能...',cat:'论证句',tag:'通用'},
  {en:'True innovation rarely emerges from ignorance; it comes from a deep understanding of existing knowledge.',cn:'真正的创新很少来自无知，它来自对现有知识的深刻理解',cat:'论证句',tag:'哲理'},
  {en:'Patience and diligence in mastering the basics ultimately pave the way for greater achievements.',cn:'耐心和勤奋地掌握基础知识，最终为更大的成就铺平道路',cat:'结尾句',tag:'教育'},
  {en:'The weight of unfinished business grows heavier over time, while the satisfaction of completing tasks promptly energizes us.',cn:'未完成事务的重量会随时间增长，而及时完成任务的满足感则给我们注入能量',cat:'论证句',tag:'哲理'},
];

let sCount=0;
db.run('BEGIN');
for(const s of sentences){
  iS.run([s.en,s.cn,s.cat,s.tag]);
  sCount++;
}
db.run('COMMIT');
saveDb();
console.log(`Seeded: ${eCount} essays, ${tCount} templates, ${sCount} sentences.`);
