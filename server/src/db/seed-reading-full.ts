import { initDb, getDb, saveDb } from './index.js';
import { initDatabase } from './init.js';

await initDatabase();
const db = getDb();

db.run('BEGIN');
try {

const insP = (t: string, c: string, s: string, d: number, wc: number, tag: string) => {
  db.run('INSERT OR IGNORE INTO reading_passages (title, content_en, source, difficulty, word_count, topic_tag) VALUES (?,?,?,?,?,?)', [t, c, s, d, wc, tag]);
  const r = db.exec('SELECT last_insert_rowid() as id');
  return r[0].values[0][0] as number;
};

const insQ = (pid: number, type: string, q: string, opts: string, ans: string, exp: string) => {
  db.run('INSERT OR IGNORE INTO reading_questions (passage_id, question_type, question_en, options_json, answer, explanation_cn) VALUES (?,?,?,?,?,?)', [pid, type, q, opts, ans, exp]);
};

// === Passage 1: Agricultural Robots (2022-12 CET-6) ===
const p1 = insP('Agricultural Robots (2022年12月真题 Passage 1)', `Perhaps it is time for farmers to put their feet up now that robots are used to inspect crops, dig up weeds, and even have become shepherds, too. Commercial growing fields are astronomically huge and take thousands of man-hours to operate. One prime example is one of Australia's most isolated cattle stations, Suplejack Downs, in the Northern Territory, stretching across 4,000 square kilometers.

These massive farms are often remote and rarely monitored just once or twice a year, meaning if livestock falls ill or requires assistance, it can be a long time before farmers discover. However, robots are coming to the rescue.

Robots are currently undergoing a two-year trial in Wales which will train "farmbots" to herd, monitor the health of livestock, and ensure there's enough pasture for them to graze on. The robots are equipped with many sensors to identify conditions of the environment, cattle and food, using thermal and vision sensors that detect changes in body temperature.

During the trials, the robot algorithms and technical details will be fine-tuned to make it better suited to ailing livestock and ensure it can safely navigate around potential obstacles including trees, mud, swamps, and hills.

Robots are not limited to herding and monitoring livestock. They have also been used to count individual fruits, inspect crops, and even pull weeds. Many robots are equipped with high-tech sensors and complex learning algorithms to avoid injuring humans as they work side by side. The robots also learn the most efficient and safest passages, allowing engineers and farmers to analyze and better optimize the attributes and tasks of the robot, and provide a live stream giving real-time feedback on exactly what is happening on the farms.

Of course, agricultural workers are worried about being replaced. However, it is farmers that are pushing for the advancements due to ever-increasing labor vacancies, making it difficult to maintain large-scale operations. As robots efficiently take up more and more agricultural work, future farms will likely experience a greater deal of autonomy.`, 'CET-6 2022年12月真题', 4, 380, '科技');

insQ(p1, 'choice', 'What may farmers be able to do with robots appearing on the farming scene?', '["A. Upgrade farm produce", "B. Enjoy more leisure hours", "C. Modify the genes of crops", "D. Cut down farming costs"]', 'B', '文章开头提到农民可以歇歇脚了，机器人承担工作后农民可享受更多闲暇');
insQ(p1, 'choice', 'What will farmbots be expected to do?', '["A. Take up many of the farmers routines", "B. Provide medical treatments for livestock", "C. Lead the trend in farming", "D. Improve the quality of pastures"]', 'A', '综合全文可知farmbots可放牧、监测牲畜、计数果实、检查作物、拔除杂草');
insQ(p1, 'choice', 'What can robots do when equipped with high-tech sensors and complex learning algorithms?', '["A. Help farmers choose the most efficient passages", "B. Help farmers simplify their farming tasks and management", "C. Allow farmers to learn instantly what is occurring on the farm", "D. Allow farmers to give real-time instructions"]', 'B', '高科技传感器使机器人能提供实时反馈，简化农业任务管理');
insQ(p1, 'choice', 'Why are farmers pressing for robotic farming?', '["A. Farming costs are fast increasing", "B. Robotics technology is maturing", "C. Robotic farming is the trend", "D. Labor shortage is worsening"]', 'D', '第9段提到due to ever-increasing labor vacancies');
insQ(p1, 'choice', 'What does the author think future farms will be like?', '["A. More and more automated", "B. More and more productive", "C. Larger and larger in scale", "D. Better and better in condition"]', 'A', '末句Future farms will likely experience a greater deal of autonomy');

// === Passage 2: Science Communication (2022-12) ===
const p2 = insP('Science Communication and Public Understanding (2022年12月真题 Passage 2)', `The public must be able to understand the basics of science to make informed decisions. Perhaps the most dramatic example of the negative consequences of poor communication between scientists and the public is the issue of climate change. The issue involves numerous factors, among which the most important is the failure to communicate basic climate data to the public, leading to widespread skepticism and misunderstanding of scientists and their research.

The issue of climate change also illustrates how the public acceptance and understanding of science (or the lack of it) can influence governmental decision-making with regard to regulation, science policy and research funding.

However, the importance of effective communication with a general audience is not limited to hot-button issues like climate change. It is also critical for socially relevant neuroscience issues, such as the genetic basis of specific behaviors, the therapeutic potential of stem cell treatments for neurodegenerative diseases, or the use of animal models, where the public's understanding of science can also influence policy and funding decisions.

Furthermore, with continuing advances in individual genome sequencing and the advent of personalized medicine, more non-scientists will need to be comfortable analyzing complex scientific information to make decisions that directly affect their quality of life.

Science journalism is an important channel for the popularization of scientific information to the public. Much has been written about how the relationship between scientists and the media can effectively communicate scientific advances to the public. Good science journalists are specialists in making complex topics accessible to a general audience, while adhering to scientific accuracy.

Unfortunately, pieces of science journalism can also oversimplify and generalize their subject material to the point that the basic information conveyed is obscured or at worst, obviously wrong. The impact of a preliminary finding on human health may be exaggerated to the point that the public believes a miraculous cure is just months away, when in fact the significance of the study is very limited.

Although scientists play an active role in communicating information to journalists and ultimately to the public, the failure in communication is often blamed on journalists. We believe that at least part of the problem does not lie in the interaction between scientists and members of the media. The problem exists because, on the one hand, we underestimate the difficulty of effective communication between scientists and various audiences; on the other hand, most scientists have not received formal training in science communication.`, 'CET-6 2022年12月真题', 5, 350, '科技');

insQ(p2, 'choice', 'What does the example of climate change serve to show?', '["A. The importance of climate data is increasingly recognized", "B. Adequate government funding is vital to scientific research", "C. Government regulation helps the public understand science", "D. Common folks scientific knowledge can sway policy making"]', 'D', '第2段说明公众对科学的理解如何影响政府决策和资金分配');
insQ(p2, 'choice', 'What should non-scientists do to ensure their quality of life?', '["A. Seek personalized medical assistance from doctors", "B. Acquire a basic understanding of medical science", "C. Have their individual genome sequenced", "D. Make informed use of animal models"]', 'B', '第3段提到非科学家需要能分析复杂科学信息');
insQ(p2, 'choice', 'Why is it important for scientists to build a good relationship with the media?', '["A. It helps them to effectively popularize new scientific information", "B. It enables the public to develop a positive attitude toward science", "C. It helps them to establish a more positive public image", "D. It enables them to apply their findings to public health"]', 'A', '第4段指出科学新闻是向公众普及科学信息的重要渠道');
insQ(p2, 'choice', 'What does the author say is the problem with science journalism?', '["A. It is keen on transmitting sensational information", "B. It tends to oversimplify peoples health problems", "C. It may give inaccurate or distorted information to the public", "D. It may provide information open to different interpretations"]', 'C', '第5段指出科学新闻可能过度简化甚至导致信息被扭曲或明显错误');
insQ(p2, 'choice', 'What should scientists do to impart their latest findings more effectively?', '["A. Give training to science journalists", "B. Stimulate public interest in science", "C. Seek timely assistance from the media", "D. Improve their communication skills"]', 'D', '末段指出大多数科学家没有接受科学传播的正式培训');

// === Passage 3: Silicon Machines (2024-12) ===
const p3 = insP('The Rise of Silicon Machines (2024年12月真题)', `The human brain contains 10 thousand million cells and each of these may have a thousand connections. Such enormous numbers used to discourage us and cause us to dismiss the possibility of making a machine with human-like ability, but now that we have grown used to moving forward at such a pace we can be less sure. Quite soon, in only 10 or 20 years perhaps, we will be able to assemble a machine as complex as the human brain, and if we can we will. It may then take us a long time to render it intelligent by loading in the right software or by altering the architecture but that too will happen.

I think it certain that in decades, not centuries, machines of silicon will arise first to rival and then exceed their human ancestors. Once they exceed us they will be capable of their own design. In a real sense they will be able to reproduce themselves. Silicon will have ended carbon's long control. And we will no longer be able to claim ourselves to be the finest intelligence in the known universe.

As the intelligence of robots increases to match that of humans and as their cost declines through economies of scale we may use them to expand our frontiers, first on earth through their ability to withstand environments harmful to ourselves. Thus, deserts may bloom and the ocean beds be mined. Further ahead, by a combination of the great wealth this new age will bring and the technology it will provide, the construction of a vast, man-created world in space, home to thousands or millions of people, will be within our power.`, 'CET-6 2024年12月真题/模拟', 4, 290, '科技');

insQ(p3, 'choice', 'In what way can we make a machine intelligent?', '["A. By making it work in extreme environments", "B. By working hard for 10 or 20 years", "C. By either properly programming it or changing its structure", "D. By reproducing it"]', 'C', '第1段末提到两种方法：安装合适软件或改变架构');
insQ(p3, 'choice', 'What does the writer think about machines with human-like ability?', '["A. He believes they will be useful to human beings", "B. He believes that they will control us in the future", "C. He is not quite sure in what way they may influence us", "D. He does not consider the construction of such machines possible"]', 'A', '末段提到智能机器人可为人类做很多好事');
insQ(p3, 'choice', 'The word "carbon" in Line 4 Para.2 stands for ____.', '["A. Intelligent robots", "B. A chemical element", "C. An organic substance", "D. Human beings"]', 'D', '硅指智能机器人，碳指人类(碳基生命)');

// === Passage 4: Education Materialism ===
const p4 = insP('Education and Materialism (2023年12月真题)', `According to a survey, which was based on the responses of over 188,000 students, today's traditional-age college freshmen are "more materialistic and less altruistic" than at any time in the 17 years of the poll.

Not surprising in these hard times, the student's major objective is to be financially well off. Less important than ever is developing a meaningful philosophy of life. It follows then that today the most popular course is not literature or history but accounting.

Interest in teaching, social service and the "altruistic" fields is at a low. On the other hand, enrollment in business programs, engineering and computer science is way up.

That's no surprise either. A friend of mine (a sales representative for a chemical company) was making twice the salary of her college instructors her first year on the job — even before she completed her two-year associate degree.

While it's true that we all need a career, it is equally true that our civilization has accumulated an incredible amount of knowledge in fields far removed from our own and that we are better for our understanding of these other contributions — be they scientific or artistic.

It is equally true that, in studying the diverse wisdom of others, we learn how to think. More important, perhaps, education teaches us to see the connections between things, as well as to see beyond our immediate needs.

Weekly we read of unions who went on strike for higher wages, only to drive their employer out of business. No company; no job. How shortsighted in the long run!

But the most important argument for a broad education is that in studying the accumulated wisdom of the ages, we improve our moral sense. I saw a cartoon recently which shows a group of businessmen looking puzzled as they sit around a conference table; one of them is talking on the intercom: "Miss Baxter, could you please send in someone who can distinguish right from wrong?"

From the long-term point of view, that's what education really ought to be about.`, 'CET-6 2023年12月真题', 3, 340, '教育');

insQ(p4, 'choice', 'According to the author, college students today ____.', '["A. have never been so materialistic as today", "B. have never been so interested in the arts", "C. have never been so financially well off", "D. have never attached so much importance to moral sense"]', 'A', '第1段引用调查结果：more materialistic and less altruistic');
insQ(p4, 'choice', 'The students criteria for selecting majors today have much to do with ____.', '["A. the influences of their instructors", "B. the financial goals they seek in life", "C. their own interpretations of the courses", "D. their understanding of the contributions of others"]', 'B', '第2段：学生的主要目标是经济富裕');
insQ(p4, 'choice', 'What does the author mean by "While it is true that... be they scientific or artistic"?', '["A. Business management should be included in education", "B. Human wisdom has accumulated at an extraordinarily high speed", "C. Human intellectual development has reached new heights", "D. The importance of a broad education should not be overlooked"]', 'D', '作者强调不能忽视通识教育的重要性');
insQ(p4, 'choice', 'Studying the diverse wisdom of others can ____.', '["A. create varying artistic interests", "B. help people see things in their right perspective", "C. help improve connections among people", "D. regulate the behavior of modern people"]', 'B', '第5-6段：学习他人的多样智慧能帮助我们学会思考');
insQ(p4, 'choice', 'Which statement is true according to the passage?', '["A. Businessmen are narrow-minded", "B. Managers find it hard to tell right from wrong", "C. Technical jobs lead to a more rewarding life", "D. Career seekers should not focus on immediate interests only"]', 'D', '全文核心论点：求职者不应只关注眼前利益');

// === Passage 5: Bureaucratic Society ===
const p5 = insP('Bureaucratic Society and Human Anxiety (社会类真题)', `In general, our society is becoming one of giant enterprises directed by a bureaucratic management in which man becomes a small, well-oiled cog in the machinery. The oiling is done with higher wages, well-ventilated factories and piped music, and by psychologists and "human-relations" experts; yet all this oiling does not alter the fact that man has become powerless, that he is bored with it. In fact, the blue and the white-collar workers have become economic puppets who dance to the tune of automated machines and bureaucratic management.

The worker and employee are anxious, not only because they might find themselves out of a job; they are anxious also because they are unable to acquire any real satisfaction of interesting life. They live and die without ever having confronted the fundamental realities of human existence as emotionally and intellectually independent and productive human beings.

Those higher up on the social ladder are no less anxious. Their lives are no less empty than those of their subordinates. They are even more insecure in some respects. They are in a highly competitive race. To be promoted or to fall behind is not a matter of salary but even more a matter of self-respect. This constant need to prove that one is as good as or better than one's fellow-competitor creates constant anxiety and stress, the very causes of unhappiness and illness.

Am I suggesting that we should return to the preindustrial mode of production? Certainly not. Problems are never solved by returning to a stage which one has already outgrown. I suggest transforming our social system from a bureaucratically managed industrialism into a humanist industrialism in which man and full development of his potentialities — those of love and of reason — are the aims of social arrangements.`, 'CET-6 社会类真题', 5, 380, '社会');

insQ(p5, 'choice', 'By "a well-oiled cog in the machinery" the author means that man is ____.', '["A. a necessary but negligible part of society", "B. working in complete harmony with society", "C. an unimportant part compared with society", "D. a humble component especially when working smoothly"]', 'C', '比喻人在官僚化工业体系中像上好油的齿轮，虽运转顺畅但与整个社会相比微不足道');
insQ(p5, 'choice', 'The real cause of anxiety of workers is that ____.', '["A. they are likely to lose their jobs", "B. they have no genuine satisfaction in life", "C. they are faced with fundamental realities", "D. they are deprived of their individuality and independence"]', 'D', '工人焦虑的根本原因是被剥夺了作为独立有生产力的人的个性和独立性');
insQ(p5, 'choice', 'Real happiness belongs to those who ____.', '["A. are at the bottom of society", "B. are higher up in social status", "C. prove better than their competitors", "D. could keep far away from this competitive world"]', 'D', '全文暗示：无论底层还是上层都在竞争中焦虑，真正幸福属于远离竞争的人');
insQ(p5, 'choice', 'The author suggests we should ____.', '["A. return to preindustrial production", "B. offer higher wages to workers", "C. enable man to fully develop his potentialities", "D. take the fundamental realities for granted"]', 'C', '末段建议将社会转变为人本主义工业体系，以人的潜能全面发展为目标');
insQ(p5, 'choice', 'The authors attitude toward industrialism is one of ____.', '["A. approval", "B. dissatisfaction", "C. suspicion", "D. susceptibility"]', 'B', '作者对现有工业主义持批评态度，认为它使人变得无能为力');

db.run('COMMIT');
saveDb();
console.log('Seeded 5 detailed reading passages with questions.');
} catch(e) {
  db.run('ROLLBACK');
  console.error(e);
}
