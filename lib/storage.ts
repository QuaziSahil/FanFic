// Simple localStorage-based storage for content management

export interface Chapter {
  id: string
  title: string
  link: string
  content?: string // Rich text content stored directly
  type: 'story' | 'audiobook'
  creditName?: string // Creator/Author credit
  creditLink?: string // Link to creator's profile (optional)
  createdAt: string
}

export interface Series {
  id: string
  title: string
  description: string
  icon: string
  image?: string // Base64 image data URL
  chapters: Chapter[]
  createdAt: string
}

const STORAGE_KEY = 'fanfic_content'

export function getAllSeries(): Series[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return getDefaultSeries()
  try {
    return JSON.parse(data)
  } catch {
    return getDefaultSeries()
  }
}

export function saveSeries(series: Series[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(series))
}

export function addSeries(title: string, description: string, icon: string, image?: string): Series {
  const series = getAllSeries()
  const newSeries: Series = {
    id: generateId(title),
    title,
    description,
    icon,
    image,
    chapters: [],
    createdAt: new Date().toISOString()
  }
  series.push(newSeries)
  saveSeries(series)
  return newSeries
}

export function deleteSeries(seriesId: string): void {
  const series = getAllSeries()
  const filtered = series.filter(s => s.id !== seriesId)
  saveSeries(filtered)
}

export function addChapter(seriesId: string, title: string, link: string, type: 'story' | 'audiobook', content?: string, creditName?: string, creditLink?: string): Chapter | null {
  const series = getAllSeries()
  const seriesIndex = series.findIndex(s => s.id === seriesId)
  if (seriesIndex === -1) return null
  
  const newChapter: Chapter = {
    id: generateId(title),
    title,
    link,
    content,
    type,
    creditName,
    creditLink,
    createdAt: new Date().toISOString()
  }
  
  series[seriesIndex].chapters.push(newChapter)
  saveSeries(series)
  return newChapter
}

export function deleteChapter(seriesId: string, chapterId: string): void {
  const series = getAllSeries()
  const seriesIndex = series.findIndex(s => s.id === seriesId)
  if (seriesIndex === -1) return
  
  series[seriesIndex].chapters = series[seriesIndex].chapters.filter(c => c.id !== chapterId)
  saveSeries(series)
}

export function getSeriesById(seriesId: string): Series | null {
  const series = getAllSeries()
  return series.find(s => s.id === seriesId) || null
}

export function resetToDefaults(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

function generateId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
}

function getDefaultSeries(): Series[] {
  return [
    {
      id: 'shadow-slave-peaceful-dreams',
      title: 'Shadow Slave - Peaceful Dreams... well... kinda.',
      description: 'A Shadow Slave fan fiction by Necroz2002. An alternate universe story featuring Sunny, Cassie, Nephis and more characters from the Shadow Slave universe.',
      icon: '🌙',
      image: '/shadow-slave-cover.jpg',
      chapters: [
        {
          id: 'chapter-1-nothing-is-ever-easy',
          title: 'Chapter 1: Nothing is ever easy',
          link: '',
          content: `<h2 class="chapter-title">Chapter 1: Nothing is Ever Easy</h2>

<p>On a small Hill, two Awakened Warriors were resting after they Patrolled the Region. But suddenly, a Shooting Star appeared on the Horizon and made its way to Bastion with incredible speed.</p>

<p class="dialogue">"Do you see that?"</p>

<p class="dialogue">"Yes... but I don't know if I'm sure that what I'm seeing right now is real or not."</p>

<p class="dialogue">"Me too. If what my eyes are telling me is real and we are not under some Mind Hex, then that Shooting Star looks like Saint Changing Star and she's... she's wearing a Bikini."</p>

<p class="dialogue">"NO. I think what we are seeing is real, but I can't believe it either."</p>

<p class="dialogue">"I wish cameras worked in the Dream Realm. Nobody will ever believe us."</p>

<p class="dialogue">"Yeah I know. Let's just not mention it to anybody, they would laugh at us anyways."</p>

<p class="dialogue">"Deal."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p>Fury burning in her eyes, Changing Star was rushing back to the Ivory Tower with astonishing speed to meet up with a beautiful and blind Saint who five minutes ago was sitting in her Office, enjoying a nice evening—and is now writing her Will, just in case.</p>

<p class="dialogue">"I can't believe you didn't tell me who he is. Do you have any Idea how I feel right now? I could cry Rivers, Cassie!"</p>

<p><em>[Neph, I'm sorry but we had a Deal. I couldn't tell you because of it.]</em></p>

<p class="dialogue">"What type of Deal? Did he threaten you?"</p>

<p><em>[NO, he... he didn't. He would never do something like that.]</em></p>

<p class="dialogue">"When I'm back we gonna talk about this and you gonna tell me EVERYTHING, you understand?"</p>

<p><em>[Yes, of course. Again, I'm sorry. I'm in my office and the Tower is empty. I'm the only one here so just get back here and I will tell you everything, OK?]</em></p>

<p class="dialogue">"You act like that was a request. I swear to the dead gods that if you leave out a single detail I'm gonna... just sit still, I'm almost there."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p>Landing on a Balcony on one of the top floors of the Ivory Tower, Nephis was making her way towards a large Double Door which had a sign on it: <em>"Saint Cassia, please knock before entering."</em></p>

<p>It was Cassie's office, of course. And the blind girl was currently trying her best to prepare for what was about to happen in a couple of seconds. She knew that this would happen—well, kinda. Since the 3rd Nightmare, her ability to see into the future had become obscured. Even if she got a glimpse at it, it wasn't reliable at all. So all she could do this time was hope that her best friend wasn't going to be too angry with her.</p>

<p>Almost ripping the Doors off the Wall, Nephis stormed into Cassie's Office. Suddenly, the Room felt like a Sauna.</p>

<p class="dialogue">"CASSIE!"</p>

<p>Nephis yelled, knowing that her voice was not Calm as it usually was. But she also didn't care right now—she was angry, and she wanted Cassie to know that.</p>

<p class="dialogue">"Here, take a seat. I have prepared something for you."</p>

<p>Nephis approached Cassie's desk and sat down on the Wooden Chair in front of it. On the Desk, she found a Note that said:</p>

<p class="thought">'Find a person with the Name Sunless, and wish him Happy Birthday on a Winter Solstice.'</p>

<p>Nephis glared at the note and then at Cassie with Confusion in her eyes.</p>

<p class="dialogue">"What is that, Cassie?"</p>

<p class="dialogue">"It's a note I wrote to myself in the past. Well, the original Note is written in Braille of course, but the meaning is the same. I can't tell you when I wrote it because I forgot, but the purpose is clear. I wrote this Note because I knew that I would forget about the person mentioned in that note, so I took precautions to ensure my future self would remember."</p>

<p class="dialogue">"So you're telling me that you knew that you would forget about Mas.... Saint Sunless? But how and why? And of all people, you never forget something important. We both know that."</p>

<p class="dialogue">"I honestly don't know how it happened because even Sunny couldn't tell me—or rather, he tried. But to my surprise, I couldn't hold on to what he said. I would continue to forget what he was trying to tell me, so we took a different approach."</p>

<p class="dialogue">"What do you mean you would instantly forget about it? How is that possible? Just tell me who he really is!"</p>

<p class="dialogue">"That I can't tell you. I can only tell you what I found out after our meetings where he showed me his memories of the past four years."</p>

<p class="dialogue">"Then start talking, Cassie. I'm growing impatient."</p>

<p class="dialogue">"OK, ok—but Nephis, would you please calm down first? You are burning holes into the stone floor and the Chair you are sitting on is on the verge of collapsing because of how much you already burned it."</p>

<p>Nephis was still in a turmoil of emotions, but she did her best to calm herself down. As she was breathing slowly, the room came back to a bearable temperature.</p>

<p class="dialogue">"OK, now listen. What I'm gonna tell you right now is everything I could puzzle together after months of me thinking about all the information that was inside of Sunny's memories—at least everything I could hold onto."</p>

<p class="dialogue">"OK then please start before I burn down your office!"</p>

<p class="dialogue">"Jeeeeze, you're beyond frustrated, aren't you?"</p>

<p>In Nephis's eyes, flames started to heat up again. But before anything else happened, Cassie yelped.</p>

<p class="dialogue">"I'm sorry, I'm sorry! Little joke on the side, hehe... OK, now I think it's for the best if I start from the very beginning."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p class="dialogue">"Half a year earlier, when I was looking for a person named Sunless, I couldn't find anything. Not a single document with that name, or someone who knew anyone with that name. But one day, a couple of the fire keepers were talking about a Café that was owned by a Master named Sunless, so I went to visit the Café. You know how the rest of that encounter went because we already talked about that part."</p>

<p class="dialogue">"Yeah, I remember. You told me that it was rather odd talking to him because you thought time passed faster than it should have been for some reason. You suspected it has something to do with his aspect, but didn't think that was the case after thinking about it."</p>

<p class="dialogue">"Right. Time seemed to pass faster as we talked. Now, about something I told you a couple of years ago. Remember when I told you about the man-shaped hole in the world?"</p>

<p class="dialogue">"Yeah, of course. You told me after our 3rd Nightmare that your foresight abilities were obstructed, and that you weren't the only seer with those issues. You told me that you found a man-shaped hole in the fabric of the world, like a person was cut from it."</p>

<p class="dialogue">"Exactly. And after I talked to Sunny, I finally knew what—or rather <em>who</em>—caused that man-shaped hole. It's Sunny, Neph. Sunny is the reason for that man-shaped hole."</p>

<p>Nephis was startled.</p>

<p class="dialogue">"Wha... what do you mean? Did he create it?"</p>

<p class="dialogue">"Yes and no. He is the cause for that hole, but he didn't purposefully create it. It was an accident. But no matter what I tried, he couldn't tell me how it happened exactly. All I know is that it happened at the end of his 3rd Nightmare—or rather, <em>our</em> 3rd Nightmare."</p>

<p class="dialogue">"What do you mean 'OUR' 3rd Nightmare? He wasn't there!"</p>

<p>Nephis was sure that she would have remembered seeing someone so handsome in her 3rd Nightmare.</p>

<p class="dialogue">"That's the thing. He was with us. But not only in the 3rd Nightmare. He was with us in Antarctica, he was with me in the 2nd nightmare, he was even with us way before that."</p>

<p class="dialogue">"Tell me Cassie, when did it all start? Since when was he with us?"</p>

<p class="dialogue">"The Forgotten Shore, Neph. Only a couple of days after we were pulled into the Dream Realm."</p>

<p>Nephis wasn't sure if she just heard her friend right.</p>

<p class="thought">'Did she just say Forgotten Shore? But that would mean....'</p>

<p class="dialogue">"Wha...what...how? That's not possible! How could I forget?"</p>

<p class="dialogue">"Like I said, I don't know. Only he does. But no matter what I tried, I couldn't remember what he told me. It was like I never asked the question."</p>

<p class="dialogue">"That's.... scary."</p>

<p class="dialogue">"Yeah, I know. But it's the truth. After my first meeting with him in the Café, he asked me to help him with something—and that's how we struck a deal of sorts."</p>

<p class="dialogue">"OK, what did he want from you, and what exactly was the deal?"</p>

<p class="dialogue">"I would help him to enter the Real Bastion, and in return he would show me his memories from the past four years."</p>

<p class="dialogue">"What did he want to do in the real Bastion?"</p>

<p class="dialogue">"He was looking for something—and he found it. It's a gigantic Labyrinth in the depths of the mountain, made out of Mirrors. But he hasn't managed to solve it yet."</p>

<p class="thought">'A Labyrinth? I wonder how he knew that it was there... but that's beside the point.'</p>

<p class="dialogue">"OK, now please tell me what these memories were. No—even better, show them to me. This would be easier."</p>

<p class="dialogue">"Neph, I don't think that's a good idea. You know that with the memories I share with you, you will also feel what's inside of those memories—what he felt in those past four years. And let me tell you... it's not pleasant."</p>

<p class="dialogue">"I don't care, Cassie. I just need to know who he truly is."</p>

<p class="dialogue">"OK, Neph. But let's go to the couch for this, because you're gonna have an enormous headache after. Believe me—the way he perceives the world is different from what you could ever imagine. It was a shock even for me."</p>

<p class="dialogue">"I don't care. Let's just get started."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p class="dialogue">"OK, Neph. Brace yourself."</p>

<p>With those words, Cassie took off her blindfold and opened her eyes for Nephis to look into them. Suddenly, a mental connection formed between the two, and Nephis lay down on the couch.</p>

<p>Cassie showed her the ordered version of the memories that Sunny had shown her, so Nephis could make sense of them more easily. After what felt like weeks—but was truly just three hours—they were done.</p>

<p>What Cassie said about the way Sunny perceived the world was true. It was strange, and it took a while for her to adjust to the way the man named Sunless perceived the world. What she said about the headache afterwards was the biggest understatement the blind seer ever made.</p>

<p>Her head felt like it would explode any second. She couldn't even sit up straight or even open her eyes. It took her a while to recover from what she just witnessed.</p>

<p>While she tried to make sense of the whole situation, she noticed something. Her face felt cold and wet. Her eyes felt sore. She noticed wet stains on the Couch. She didn't realize what had happened, but in the past couple of hours... she cried. She must have cried a lot, considering the amount of tissues Cassie had used to wipe her face.</p>

<p>After fifteen minutes, Cassie spoke for the first time in hours.</p>

<p class="dialogue">"Nephis, are... are you OK? I know it's a lot to handle. I needed days to fully recover mentally from what Sunny had shown me, so don't stress yourself. I will bring you to bed if you want me to."</p>

<p class="dialogue">"No... I... I don't know what to say. It's... too much to handle for a single person. How did he survive that? Not just the fight against the Winter Beast, but the hollow mountains as well. He just went into the mist. It's amazing how long he survived—and he even managed to reach the Forgotten Shore. And all these feelings... the fear, that feeling of emptiness, and of course... the Sorrow. It's all so depressing. How can he be this joyful and happy after what he went through?"</p>

<p>Nephis knew a thing or two about Pain. But she never experienced that type of pain. Even when her Father died, or when her Grandmother passed away, she never felt this much emotional stress.</p>

<p class="dialogue">"He told me that after he decided to come back to society, he just tried not to think about the past couple of years and just focused on the future he tried to build."</p>

<p class="dialogue">"I understand. But still, it's astonishing what he achieved in those years. It's like he never gave up—but that's not true of course. He even told me once that there was a time when he was done with the world. I brushed it off as a minor issue, nothing to really worry about. But now I know what really happened."</p>

<p class="dialogue">"He made a Choice. The choice to come back and to help us, even if we didn't remember him. He made it his Mission to do everything in his power to support us—to support <em>you</em>, Neph."</p>

<p class="dialogue">"You noticed it too, right? That he has no connection to the spell, I mean."</p>

<p class="dialogue">"I guess being Forgotten by the world also means being Forgotten by the spell. Having to learn how to enter your Soul Sea took him about a year. The spell really is a blessing in some way, I guess."</p>

<p class="dialogue">"Yeah... unfortunately, it is."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p class="dialogue">"What do you plan on doing now? He's currently in his Caffè. And you forgot your dress, by the way."</p>

<p class="dialogue">"What... oh right. I left in a rush and forgot the dress. Fuck. I really want to talk to him. Knowing who he is and what he went through really helps me understand him better now."</p>

<p class="dialogue">"I can tell him that we can meet in his Café, or maybe he wants to come to the Tower. You know, he can be here in a second if I ask him."</p>

<p class="dialogue">"I don't know how to approach him though."</p>

<p class="thought">'Does he hate me because I just left without letting him explain? No... I guess he's just sad that I didn't give him the chance. I will have to apologize to him for that.'</p>

<p class="dialogue">"Well, after I found out about all of this, we just drank some tea and talked about it. So how about we go over and do the same? But maybe we do that tomorrow—you look exhausted, and you need to put on some clothes first."</p>

<p>Cassie chuckled slightly, hoping her best friend wasn't going to burn down her Office anymore.</p>

<p class="dialogue">"Already making jokes, huh? I never said I forgive you for keeping all that from me for so long."</p>

<p class="thought">'I should have waited till tomorrow at least.'</p>

<p class="dialogue">"Hey, I apologized! You know how hard that is for me. I just tried to protect you."</p>

<p class="dialogue">"I was just joking. I know why you didn't tell me... but I'm still mad at you."</p>

<p class="dialogue">"That's alright. I can live with you being a little mad at me for a couple of days. I will make it up to you though."</p>

<p class="dialogue">"How?"</p>

<p class="dialogue">"That's a secret. Now let's get you into a bath and then to bed—you need the sleep for our visit to Sunny tomorrow."</p>

<p class="dialogue">"Alright. But before that, answer me one more question. Who is that girl in the song domain that one of his Clones follows? I feel like I know her from somewhere, but I can't quite remember."</p>

<p class="dialogue">"As far as I know, that's his student. He's been teaching her how to survive and hunt since he returned to society. As for why you feel like you know her—I remember her as well. But I guess because she's close to Sunny, we also kinda forgot about her. We certainly met her before, but I didn't ask him about her, so I don't know more than you do now."</p>

<p class="dialogue">"Mhmmm, ok. But it's odd, don't you think? She kinda looks like him. Oh no... you don't think that's his daughter and he lied to me when he said that he doesn't have a wife and kids, do you?"</p>

<p class="dialogue">"She's a little too old to be his daughter, don't you think?"</p>

<p class="dialogue">"OH yeah, you're right. I'm too exhausted and can't think straight."</p>

<p class="dialogue">"Right. Now let's go."</p>

<p class="dialogue">"Thank you, Cassie, for showing me all of this. I'm glad you're my friend."</p>

<p class="dialogue">"No problem. Goodnight, Neph. I will wait for you in my office when you wake up."</p>

<p class="dialogue">"OK, Cass. Good night."</p>

<p class="chapter-end">— End of Chapter 1 —</p>`,
          type: 'story',
          creditName: 'Necroz2002',
          creditLink: 'https://archiveofourown.org/users/Necroz2002/pseuds/Necroz2002',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }
  ]
}
