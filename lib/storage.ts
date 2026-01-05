// Firestore-based storage for content management
// Content is stored in Firebase and visible to ALL users

import {
  getAllSeriesFromFirestore,
  getSeriesByIdFromFirestore,
  addSeriesToFirestore,
  deleteSeriesFromFirestore,
  addChapterToFirestore,
  deleteChapterFromFirestore,
  updateChapterInFirestore,
  Series,
  Chapter
} from './firebase'

// Re-export types
export type { Series, Chapter }

// Local cache for performance
let seriesCache: Series[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 30000 // 30 seconds

// Get all series (with caching)
export async function getAllSeriesAsync(): Promise<Series[]> {
  const now = Date.now()
  if (seriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return seriesCache
  }
  
  const series = await getAllSeriesFromFirestore()
  
  // If Firestore is empty, return default series
  if (series.length === 0) {
    return getDefaultSeries()
  }
  
  seriesCache = series
  cacheTimestamp = now
  return series
}

// Sync version for initial render (returns cache or default)
export function getAllSeries(): Series[] {
  if (seriesCache) return seriesCache
  return getDefaultSeries()
}

// Get series by ID
export async function getSeriesByIdAsync(seriesId: string): Promise<Series | null> {
  // Check cache first
  if (seriesCache) {
    const cached = seriesCache.find(s => s.id === seriesId)
    if (cached) return cached
  }
  
  const series = await getSeriesByIdFromFirestore(seriesId)
  if (series) return series
  
  // Fallback to default
  const defaults = getDefaultSeries()
  return defaults.find(s => s.id === seriesId) || null
}

// Sync version
export function getSeriesById(seriesId: string): Series | null {
  if (seriesCache) {
    return seriesCache.find(s => s.id === seriesId) || null
  }
  const defaults = getDefaultSeries()
  return defaults.find(s => s.id === seriesId) || null
}

// Add series
export async function addSeries(title: string, description: string, icon: string, image?: string): Promise<Series | null> {
  const result = await addSeriesToFirestore(title, description, icon, image)
  if (result) {
    seriesCache = null // Invalidate cache
  }
  return result
}

// Delete series
export async function deleteSeries(seriesId: string): Promise<void> {
  await deleteSeriesFromFirestore(seriesId)
  seriesCache = null // Invalidate cache
}

// Add chapter
export async function addChapter(
  seriesId: string,
  title: string,
  link: string,
  type: 'story' | 'audiobook',
  content?: string,
  creditName?: string,
  creditLink?: string
): Promise<Chapter | null> {
  const result = await addChapterToFirestore(seriesId, title, link, type, content, creditName, creditLink)
  if (result) {
    seriesCache = null // Invalidate cache
  }
  return result
}

// Delete chapter
export async function deleteChapter(seriesId: string, chapterId: string): Promise<void> {
  await deleteChapterFromFirestore(seriesId, chapterId)
  seriesCache = null // Invalidate cache
}

// Update chapter
export async function updateChapter(seriesId: string, chapterId: string, updates: Partial<Chapter>): Promise<void> {
  await updateChapterInFirestore(seriesId, chapterId, updates)
  seriesCache = null // Invalidate cache
}

// Invalidate cache (call after admin changes)
export function invalidateCache(): void {
  seriesCache = null
  cacheTimestamp = 0
}

// Initialize cache from Firestore
export async function initializeCache(): Promise<void> {
  await getAllSeriesAsync()
}

// Save series (legacy compatibility - now does nothing, use individual functions)
export function saveSeries(_series: Series[]): void {
  // No-op for Firestore - changes are saved immediately
  console.warn('saveSeries is deprecated with Firestore. Changes are saved automatically.')
}

// Reset to defaults (for admin use)
export function resetToDefaults(): void {
  seriesCache = null
  cacheTimestamp = 0
}

// Default series (shown when Firestore is empty)
function getDefaultSeries(): Series[] {
  return [
    {
      id: 'shadow-slave-peaceful-dreams',
      title: 'Shadow Slave - Peaceful Dreams... well... kinda',
      description: 'An alternate universe story set after Sunny told Nephis that he\'s the Lord of Shadows. Featuring Sunny, Cassie, Nephis, Kai, Effie, Jet, Rain and more beloved characters from the Shadow Slave universe. 30 Chapters • 209,196 Words • Completed',
      icon: '⚔️',
      chapters: [
        {
          id: 'chapter-1-audiobook',
          title: 'Chapter 1: Nothing is ever easy (Audiobook)',
          type: 'audiobook',
          link: 'https://archive.org/details/ss-fanfic-1',
          creditName: 'Necroz2002',
          creditLink: 'https://archiveofourown.org/users/Necroz2002/pseuds/Necroz2002',
          createdAt: new Date().toISOString()
        },
        {
          id: 'chapter-1-story',
          title: 'Chapter 1: Nothing is ever easy',
          type: 'story',
          link: '',
          content: `<div class="chapter-content">
<p class="scene-break">✦ ✦ ✦</p>

<p>On a small Hill 2 Awakened Warriors were resting after they Patrolled the Region, but suddenly a Shooting Star appeared on the Horizon and made its way to Bastion with incredible speed.</p>

<p class="dialogue">"Do you see that?"</p>

<p class="dialogue">"Yes but I don't know if I'm sure that what I'm seeing right now is real or not?"</p>

<p class="dialogue">"Me too, if what my eyes are telling me is real and we are not under some Mind Hex, then that Shooting Star looks like Saint Changing Star and she's... she's wearing a Bikini."</p>

<p class="dialogue">"NO I think what we are seeing is real, but I can't believe it either."</p>

<p class="dialogue">"I wish cameras worked in the Dream Realm, nobody will ever believe us"</p>

<p class="dialogue">"Yeah I know, let's just not mention it to anybody, they would laugh at us anyways."</p>

<p class="dialogue">"Deal"</p>

<p class="scene-break">✦ ✦ ✦</p>

<p>Fury burning in her eyes, <span class="character-name">Changing Star</span> was rushing back to the Ivory Tower with astonishing speed to meet up with a beautiful and blind Saint who 5 minutes ago was sitting in her Office, enjoying a nice evening and is now writing her Will, just in case.</p>

<p class="dialogue">"I can't believe you didn't tell me who he is, do you have any Idea how I feel right now? I could cry Rivers, Cassie"</p>

<p class="dialogue cassie">[Neph I'm sorry but we had a Deal, I couldn't tell you because of it.]</p>

<p class="dialogue">"What type of Deal? Did he threaten you?"</p>

<p class="dialogue cassie">[NO, he... he didn't, he would never do something like that.]</p>

<p class="dialogue">"When I'm back we gonna talk about this and you gonna tell me EVERYTHING you understand?"</p>

<p class="dialogue cassie">[Yes ofc, again I'm sorry, I'm in my office and the Tower is empty. I'm the only one here so just get back here and I will tell you everything OK?]</p>

<p class="dialogue">"You act like that was a request, I swear to the dead gods that if you leave out a single detail I'm gonna... just sit still I'm almost there"</p>

<p class="scene-break">✦ ✦ ✦</p>

<p>Landing on a Balcony on one of the top floors of the Ivory Tower, <span class="character-name">Nephis</span> was making her way towards a large Double Door which had a sign on it <em>"Saint Cassia, please knock before entering"</em> — it was Cassie's office ofc, and the blind girl was currently trying her best to prepare for what is about to happen in a couple of seconds.</p>

<p>She knew that this would happen ofc, well kinda, since the 3rd Nightmare her ability to see into the future is obscured and even if she gets a glimpse at it, it's not reliable at all so all she could do this time is hope that her best friend is not gonna be too angry with her.</p>

<p>Almost ripping the Doors off the Wall, <span class="character-name">Nephis</span> stormed into Cassie's Office and suddenly the Room felt like a Sauna.</p>

<p class="dialogue nephis">"CASSIE"</p>

<p>Nephis yelled, knowing that her voice was not Calm as it usually was, but she also didn't care right now, she was angry and she wanted Cassie to know that.</p>

<p class="dialogue">"Here take a seat I have prepared something for you"</p>

<p>Nephis was approaching Cassie's desk and sat down on the Wooden Chair in front of it. On the Desk she found a Note that said:</p>

<blockquote class="note">'Find a person with the Name Sunless, and wish him Happy Birthday on a Winter Solstice.'</blockquote>

<p>Nephis was glaring at the note and then at Cassie with Confusion in her Eyes.</p>

<p class="dialogue">"What is that Cassie?"</p>

<p class="dialogue">"It's a note I wrote to myself in the past. Well, the original Note is written in Braille ofc but the meaning is the same. I can't tell you when I wrote it because I forgot but the purpose is clear. I wrote this Note because I knew that I would forget about the person mentioned in that note so I took precautions to ensure my future self would remember."</p>

<p class="dialogue">"So you're telling me that you knew that you would forget about Mas.... Saint Sunless? But how and why? And of all people, you never forget something important. We both know that."</p>

<p class="dialogue">"I honestly don't know how it happened because even Sunny couldn't tell me or rather he tried but to my surprise I couldn't hold on to what he said because I would continue to forget what he was trying to tell me, so we took a different approach."</p>

<p class="dialogue">"What do you mean you would instantly forget about it? How is that possible? Just tell me who he really is."</p>

<p class="dialogue">"That I can't tell you, I can only tell you what I found out after our meetings where he showed me his memories of the past 4 years"</p>

<p class="dialogue">"Then start talking Cassie, I'm growing impatient"</p>

<p class="dialogue">"OK ok but Nephis would you please calm down first? You are burning holes into the stone floor and the Chair you are sitting on is on the verge of collapsing because of how much you already burned it."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p>Nephis was still in a turmoil of emotions but she did her best to calm herself down. As she was Breathing slowly the room came back to a bearable temperature.</p>

<p class="dialogue">"OK now listen, what I'm gonna tell you right now is everything I could puzzle together after months of me thinking about all the information that was inside of Sunny's memories, at least everything I could hold onto."</p>

<p class="dialogue">"OK then please start before I burn down your office!"</p>

<p class="dialogue">"Jeeeeze, you're beyond frustrated, aren't you?"</p>

<p>In Nephis' eyes flames started to heat up again but before anything else happened Cassie yelped.</p>

<p class="dialogue">"I'm sorry I'm sorry, little joke on the side hehe... OK now I think it's for the best If I start from the very beginning. Half a year earlier when I was looking for a person named Sunless I couldn't find anything, not a single document with that name or someone who knew anyone with that name. But one day a couple of the fire keepers were talking about a Café that was owned by a Master named Sunless, so I went to visit the Café, you know how the rest about that encounter went because we already talked about that part."</p>

<p class="dialogue">"Yeah I remember you told me that it was rather odd talking to him because you thought time passed faster as it should have been for some reason, you suspected it has something to do with his aspect but didn't think that that's the case after thinking about it."</p>

<p class="dialogue">"Right, time seemed to pass faster as we talked, now about something I told you a couple of years ago. Remember when I told you about the man-shaped hole in the world?"</p>

<p class="dialogue">"Yeah ofc, you told me after our 3rd Nightmare that your foresight abilities were obstructed and that you weren't the only seer with those issues. You told me that you found a man-shaped hole in the fabric of the world like a person was cut from it."</p>

<p class="dialogue">"Exactly, and after I talked to Sunny I finally knew what or rather who caused that man shaped hole. It's Sunny, Neph. <strong>Sunny is the reason for that man-shaped hole.</strong>"</p>

<p>Nephis was startled.</p>

<p class="dialogue">"Wha... what do you mean, did he create it?"</p>

<p class="dialogue">"Yes and no, he is the cause for that hole but he didn't purposefully create it, it was an accident. But no matter what I tried he couldn't tell me how it happened exactly, all I know is that it happened at the end of his 3rd Nightmare or rather our 3rd Nightmare."</p>

<p class="dialogue">"What do you mean 'OUR' 3rd Nightmare? He wasn't there!"</p>

<p>Nephis was sure that she would have remembered seeing someone so handsome in her 3rd Nightmare.</p>

<p class="dialogue">"That's the thing, he was with us, but not only in the 3rd Nightmare. He was with us in Antarctica, he was with me in the 2nd nightmare, he was even with us way before that."</p>

<p class="dialogue">"Tell me Cassie, when did it all start? Since when was he with us?"</p>

<p class="dialogue">"<em>The Forgotten Shore</em> Neph, only a couple of days after we were pulled into the Dream Realm."</p>

<p>Nephis wasn't sure if she just heard her friend right.</p>

<p class="thought">'Did she just say Forgotten Shore? But that would mean....'</p>

<p class="dialogue">"Wha...what...how? That's not possible, how could I forget?"</p>

<p class="dialogue">"Like I said, I don't know, only he does but no matter what I tried I couldn't remember what he told me. It was like I never asked the question."</p>

<p class="dialogue">"That's.... scary"</p>

<p class="dialogue">"Yeah I know but it's the truth, after my first Meeting with him in the Café he asked me to help him with something and that's how we Struck a deal of sorts."</p>

<p class="dialogue">"OK what did he want from you and what exactly was the deal?"</p>

<p class="dialogue">"I would help him to enter the Real Bastion and in return he would Show me his memories from the past 4 years."</p>

<p class="dialogue">"What did he want to do in the real Bastion?"</p>

<p class="dialogue">"He was looking for something and he found it. It's a gigantic Labyrinth in the depths of the mountain made out of Mirrors, but he hasn't managed to solve it yet."</p>

<p class="thought">'A Labyrinth? I wonder how he knew that it was there... but that's beside the point.'</p>

<p class="dialogue">"OK now please tell me what these memories were, no even better, show them to me, this would be easier."</p>

<p class="dialogue">"Neph I don't think that's a good Idea, you know that with the memories I share with you that you will also feel what's inside of those memories, what he felt in those past 4 years and let me tell you, it's not pleasant."</p>

<p class="dialogue">"I don't care Cassie, I just need to know who he truly is."</p>

<p class="dialogue">"OK Neph but let's go to the couch for this, because you're gonna have an enormous headache after. Believe me, the way he perceives the world is different from what you could ever imagine. It was a shock even for me."</p>

<p class="dialogue">"I don't care, let's just get started"</p>

<p class="dialogue">"OK Neph, brace yourself"</p>

<p class="scene-break">✦ ✦ ✦</p>

<p>With those words <span class="character-name">Cassie</span> took off her blindfold and opened her eyes for Nephis to look into them, suddenly a mental connection formed between the 2 and Nephis lay down on the couch.</p>

<p>Cassie showed her the ordered version of the memories that Sunny had shown her so Nephis could make sense of them more easily. After what felt like Weeks but was truly just 3 Hours they were done and what Cassie said about the way Sunny perceived the world was true, it was strange and it took a while for her to adjust to the way the man named <span class="character-name">Sunless</span> perceived the world.</p>

<p>What she said about the headache afterwards was the biggest understatement the blind seer ever made. Her head felt like it would explode any second and she couldn't even sit up straight or even open her eyes. It took her a while to recover from what she just witnessed and while she tried to make sense of the whole situation, she noticed something.</p>

<p>Her face felt cold and wet, her eyes felt sore and she noticed wet stains on the Couch. She didn't realize what had happened, but in the past couple of hours she cried. She must have cried a lot considering the amount of Tissues Cassie had used to wipe her face.</p>

<p>After 15 minutes Cassie spoke for the first time in Hours.</p>

<p class="dialogue">"Nephis, are... are you OK? I know it's a lot to handle, I needed days to fully recover mentally from what Sunny had shown me, so don't stress yourself. I will bring you to bed if you want me to."</p>

<p class="dialogue">"No... I... I don't know what to say it's... too much to handle for a single person, how did he survive that? Not just the fight against the Winter Beast, but the hollow mountains as well. He just went into the mist. It's amazing how long he survived and he even managed to reach the Forgotten Shore. And all these feelings, the fear, that feeling of emptiness and ofc… <em>the Sorrow</em>, it's all so depressing. How can he be this joyful and happy after what he went through?"</p>

<p>Nephis knew a thing or 2 about Pain, but she never experienced that type of pain. Even when her Father died or when her Grandmother passed away, she never felt this much emotional stress.</p>

<p class="dialogue">"He told me that after he decided to come back to society, that he just tried not to think about the past couple of years and just focused on the future he tried to build."</p>

<p class="dialogue">"I understand, but still, it's astonishing what he achieved in those years. It's like he never gave up but that's not true ofc, he even told me once that there was a time when he was done with the world. I brushed it off as a minor issue, nothing to really worry about but now I know what really happened."</p>

<p class="dialogue">"He made a Choice. The choice to come back and to help us, even if we didn't remember him, he made it his Mission to do everything in his power to Support us, to Support you Neph."</p>

<p class="dialogue">"You noticed it too, right? That he has no connection to the spell I mean."</p>

<p class="dialogue">"I guess being Forgotten by the world also means being Forgotten by the spell. Having to learn how to enter your Soul sea took him about a year. The spell really is a blessing in some way, I guess."</p>

<p class="dialogue">"Yeah, unfortunately it is."</p>

<p class="dialogue">"What do you plan on doing now? He's currently in his Café. And you forgot your dress by the way."</p>

<p class="dialogue">"What... oh right, I left in a rush and forgot the dress, fuck. I really wanna talk to him knowing who he is and what he went through really helps me understand him better now."</p>

<p class="dialogue">"I can tell him that we can meet in his Café, or maybe he wants to come to the Tower. You know he can be here in a second if I ask him."</p>

<p class="dialogue">"I don't know how to approach him though."</p>

<p class="thought">'Does he hate me because I just left without letting him explain? No I guess he's just sad that I didn't give him the chance, I will have to apologize to him for that.'</p>

<p class="dialogue">"Well after I found out about all of this we just drank some tea and talked about it, so how about we go over and do the same, but maybe we do that tomorrow you look exhausted and you need to put on some clothes first."</p>

<p>Cassie chuckled slightly hoping her best friend isn't going to burn down her Office anymore.</p>

<p class="dialogue">"Already making jokes huh? I never said I forgive you for keeping all that from me for so long."</p>

<p class="thought">'I should have waited till tomorrow at least.'</p>

<p class="dialogue">"Hey I apologized. You know how hard that is for me. I just tried to protect you."</p>

<p class="dialogue">"I was just joking, I know why you didn't tell me but I'm still mad at you."</p>

<p class="dialogue">"That's alright, I can live with you being a little mad at me for a couple of days. I will make it up to you though."</p>

<p class="dialogue">"How?"</p>

<p class="dialogue">"That's a secret, now let's get you into a bath and then to bed, you need the sleep for our visit to Sunny tomorrow."</p>

<p class="dialogue">"Alright, but before that, answer me one more question. Who is that girl in the Song Domain that one of his Clones follows? I feel like I know her from somewhere but I can't quite remember."</p>

<p class="dialogue">"As far as I know, that's his student. He's been teaching her how to Survive and Hunt since he Returned to Society. As for why you feel like you know her, I remember her as well, but I guess because she's close to Sunny we also kinda forgot about her. We certainly met her before but I didn't ask him about her so I don't know more than you do now."</p>

<p class="dialogue">"Mhmmm ok, but it's odd don't you think? She kinda looks like him. Oh no… you don't think that's his daughter and he lied to me when he said that he doesn't have a wife and kids, do you?"</p>

<p class="dialogue">"She's a little too old to be his daughter don't you think?"</p>

<p class="dialogue">"OH yeah you're right, I'm too exhausted and can't think straight."</p>

<p class="dialogue">"Right, now let's go."</p>

<p class="dialogue">"Thank you Cassie for showing me all of this, I'm glad you're my friend."</p>

<p class="dialogue">"No problem, goodnight Neph. I will wait for you in my office when you wake up."</p>

<p class="dialogue">"OK Cass, good night."</p>

<p class="scene-break">✦ ✦ ✦</p>

<p class="chapter-end">— End of Chapter 1 —</p>
</div>`,
          creditName: 'Necroz2002',
          creditLink: 'https://archiveofourown.org/users/Necroz2002/pseuds/Necroz2002',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }
  ]
}
