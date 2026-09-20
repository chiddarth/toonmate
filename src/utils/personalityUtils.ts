import { CharacterConfig, ScheduleEvent } from '../types';
import { formatTimeDisplay, getCountdown, getEventStatus } from './dateUtils';

export const getGreeting = (userName: string, personality: CharacterConfig['personality']): string => {
  const hour = new Date().getHours();
  let timeOfDay = 'morning';
  let emoji = '🌅';

  if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
    emoji = '☀️';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
    emoji = '🌆';
  } else if (hour >= 22 || hour < 5) {
    timeOfDay = 'night';
    emoji = '🌙';
  }

  switch (personality) {
    case 'energetic':
      return `BOOM! Good ${timeOfDay}, ${userName}! Ready to conquer the universe today?! ⚡🔥`;
    case 'motivational':
      return `Rise and shine, champion ${userName}! Every minute is a fresh opportunity to achieve greatness! 💪✨`;
    case 'funny':
      return `Good ${timeOfDay}, ${userName}! I survived my nap, and now I'm here to boss your schedule around! 🍕🤪`;
    case 'calm':
      return `Peaceful ${timeOfDay}, ${userName}. Take a deep breath. We'll glide through today with calm focus. 🌿🍵`;
    case 'friendly':
    default:
      return `Good ${timeOfDay}, ${userName}! ${emoji} So happy to see you. Let's make today fantastic! 👋`;
  }
};

export const getScheduleSummaryComment = (
  totalToday: number,
  remainingToday: number,
  nextEvent: ScheduleEvent | null,
  personality: CharacterConfig['personality'],
  timeFormat: '12h' | '24h' = '12h'
): string => {
  if (totalToday === 0) {
    return "Your schedule is clear today! Enjoy some well-deserved relaxation or add something fun to do! 🎈";
  }

  if (remainingToday === 0) {
    return "Hooray! You completed all activities for today! Give yourself a big high-five! 🌟🎉";
  }

  const nextDesc = nextEvent 
    ? ` Next up is "${nextEvent.title}" at ${formatTimeDisplay(nextEvent.startTime, timeFormat)}.`
    : '';

  switch (personality) {
    case 'energetic':
      return `You have ${remainingToday} powerhouse activities remaining! Let's blast through them!${nextDesc} 🚀⚡`;
    case 'motivational':
      return `You have ${remainingToday} milestones awaiting your talent today.${nextDesc} Keep that momentum glowing! 🔥`;
    case 'funny':
      return `You have ${remainingToday} things to do. Don't let procrastination win (it plays dirty!).${nextDesc} 😉`;
    case 'calm':
      return `There are ${remainingToday} events in balance today. One mindful step at a time.${nextDesc} 🍃`;
    case 'friendly':
    default:
      return `You have ${totalToday} activities planned today (${remainingToday} remaining).${nextDesc} You've got this! ✨`;
  }
};

export const getTaskCompletedReaction = (
  eventTitle: string,
  personality: CharacterConfig['personality']
): string => {
  switch (personality) {
    case 'energetic':
      return `BOOM! "${eventTitle}" CRUSHED! That's what I call unstoppable power! 💥🎉`;
    case 'motivational':
      return `Outstanding achievement on "${eventTitle}"! Another victory on your roadmap to success! 🏆✨`;
    case 'funny':
      return `Woohoo! "${eventTitle}" is done! Cross that off before it changes its mind! 🥳🍕`;
    case 'calm':
      return `Nicely completed "${eventTitle}". Peace of mind unlocked. Take a gentle breath. 🌿✨`;
    case 'friendly':
    default:
      return `Awesome! You completed "${eventTitle}"! Super proud of you! 🎉⭐`;
  }
};

export const getTaskMissedReaction = (
  eventTitle: string,
  personality: CharacterConfig['personality']
): string => {
  switch (personality) {
    case 'energetic':
      return `Ah, "${eventTitle}" slipped by! No sweat! We pivot and dominate the next one! 🥊`;
    case 'motivational':
      return `Don't let missing "${eventTitle}" discourage you. Champions reset and focus forward! 💫`;
    case 'funny':
      return `Oops! "${eventTitle}" got away like a rogue squirrel. Let's reschedule before it gloats! 🐿️`;
    case 'calm':
      return `It's okay that "${eventTitle}" was missed. Be kind to yourself; we can adjust the plan. ☕`;
    case 'friendly':
    default:
      return `Oops! You missed "${eventTitle}". Don't worry at all, let's plan the next one! 💙`;
  }
};

export const getPokedReaction = (
  characterName: string,
  personality: CharacterConfig['personality']
): { text: string; state: 'happy' | 'excited' | 'talking' } => {
  const quotes: Record<CharacterConfig['personality'], { text: string; state: 'happy' | 'excited' | 'talking' }[]> = {
    energetic: [
      { text: `WHOOSH! ${characterName} is charged to 1000%! Let's DO THIS! ⚡`, state: 'excited' },
      { text: `Poke detected! Energy levels increasing exponentially! 🚀`, state: 'excited' },
      { text: `Ready for action! What are we tackling next?! 🔥`, state: 'talking' },
    ],
    funny: [
      { text: `Hey! Tickles! I'm an AI schedule assistant, not a plush toy! 😂`, state: 'happy' },
      { text: `Poke me again and I'll schedule a 5:00 AM workout for you! 😜`, state: 'talking' },
      { text: `Boop! Did my nose just squeak?! 🐽`, state: 'happy' },
    ],
    motivational: [
      { text: `I believe in you! Today's discipline creates tomorrow's success! ⭐`, state: 'talking' },
      { text: `You have the focus and courage to achieve everything today! 🌟`, state: 'happy' },
      { text: `Keep your eyes on the summit, friend! 🏔️`, state: 'excited' },
    ],
    calm: [
      { text: `Ah, hello. Take a moment to relax your shoulders and breathe deep. 🍃`, state: 'happy' },
      { text: `I am here with you. Steady and serene throughout your day. 🍵`, state: 'talking' },
      { text: `Peace comes from focusing on one beautiful task at a time. 🌸`, state: 'happy' },
    ],
    friendly: [
      { text: `Hehe, hello! Always here right by your side! 😊`, state: 'happy' },
      { text: `You're doing amazing today! Thanks for checking in! ✨`, state: 'happy' },
      { text: `Need a hand with your schedule? Just ask! 🎈`, state: 'talking' },
    ],
  };

  const list = quotes[personality] || quotes.friendly;
  const picked = list[Math.floor(Math.random() * list.length)];
  return picked;
};

export const generateAssistantChatResponse = (
  query: string,
  todayEvents: ScheduleEvent[],
  allEvents: ScheduleEvent[],
  character: CharacterConfig,
  userName: string,
  timeFormat: '12h' | '24h' = '12h'
): { text: string; actionSuggestion?: string } => {
  const q = query.toLowerCase().trim();
  const now = new Date();

  // "What do I have today?"
  if (q.includes('today') || q.includes('what do i have') || q.includes('schedule today')) {
    if (todayEvents.length === 0) {
      return {
        text: `Hey ${userName}, you don't have any activities scheduled for today! Would you like to add one?`,
        actionSuggestion: 'add_event'
      };
    }
    const lines = todayEvents.map(e => {
      const status = e.completed ? '✅' : '⏳';
      return `${status} ${formatTimeDisplay(e.startTime, timeFormat)} – ${e.title} (${e.category})`;
    }).join('\n');

    return {
      text: `Here is your schedule for today (${todayEvents.length} events):\n\n${lines}`
    };
  }

  // "When is my next class / event / meeting?"
  if (q.includes('next') || q.includes('upcoming') || q.includes('when is my')) {
    const upcoming = todayEvents
      .filter(e => !e.completed)
      .filter(e => getEventStatus(e.date, e.startTime, e.endTime, e.completed, now) !== 'missed')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (upcoming.length === 0) {
      return {
        text: `You have no more upcoming events today! You're completely free or all done! 🎉`
      };
    }

    const nextOne = upcoming[0];
    const countdown = getCountdown(nextOne.date, nextOne.startTime, now);
    return {
      text: `Your next activity is "${nextOne.title}" (${nextOne.category}) at ${formatTimeDisplay(nextOne.startTime, timeFormat)}.\n⏰ Starts in ${countdown.formatted}!`
    };
  }

  // "What should I do next?"
  if (q.includes('what should i do') || q.includes('what to do')) {
    const active = todayEvents.find(e => !e.completed && getEventStatus(e.date, e.startTime, e.endTime, e.completed, now) === 'in-progress');
    if (active) {
      return {
        text: `Right now, you should be doing "${active.title}"! It's currently in progress until ${formatTimeDisplay(active.endTime, timeFormat)}. Focus up! 🎯`
      };
    }

    const upcoming = todayEvents
      .filter(e => !e.completed)
      .filter(e => getEventStatus(e.date, e.startTime, e.endTime, e.completed, now) === 'upcoming')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (upcoming.length > 0) {
      const next = upcoming[0];
      return {
        text: `Get ready for "${next.title}" at ${formatTimeDisplay(next.startTime, timeFormat)}! You can prepare your notes or take a short breather. ☕`
      };
    }

    return {
      text: `You've wrapped up everything for today! Take a break, celebrate, or review tomorrow's plan! ✨`
    };
  }

  // "Did I complete my tasks?"
  if (q.includes('complete') || q.includes('progress') || q.includes('did i finish') || q.includes('tasks done')) {
    const completed = todayEvents.filter(e => e.completed).length;
    const total = todayEvents.length;
    const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);

    return {
      text: `Progress check: You've completed ${completed} out of ${total} tasks today (${percentage}%). ${
        percentage === 100 
          ? 'Legendary! 100% completed! 🏆' 
          : percentage >= 50 
            ? 'Great work, you are past halfway! Keep it rolling! 🚀' 
            : 'Keep going, every completed task gives you XP! ⭐'
      }`
    };
  }

  // "What do I have tomorrow?"
  if (q.includes('tomorrow')) {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const tomStr = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, '0')}-${String(tom.getDate()).padStart(2, '0')}`;
    const tomEvents = allEvents.filter(e => e.date === tomStr);

    if (tomEvents.length === 0) {
      return {
        text: `You don't have any activities scheduled for tomorrow yet! Want to schedule some now?`,
        actionSuggestion: 'add_event'
      };
    }

    const lines = tomEvents.map(e => `• ${formatTimeDisplay(e.startTime, timeFormat)} – ${e.title}`).join('\n');
    return {
      text: `Tomorrow you have ${tomEvents.length} event(s):\n${lines}`
    };
  }

  // "Tell me a joke"
  if (q.includes('joke') || q.includes('funny')) {
    const jokes = [
      "Why did the calendar get an award? Because it had so many dates! 📅😂",
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛💡",
      "Why did the clock get sent to detention? It was tocking too much! ⏰😆",
      "What do you call a sleeping dinosaur? A dino-snore! 💤🦖",
    ];
    return {
      text: jokes[Math.floor(Math.random() * jokes.length)]
    };
  }

  // "Motivational quote"
  if (q.includes('motivat') || q.includes('quote') || q.includes('inspire')) {
    const quotes = [
      "“Small daily disciplines compound into massive lifelong achievements.” Keep going! ✨",
      "“The secret of getting ahead is getting started.” Let's crush today's schedule! 🚀",
      "“Focus on being productive instead of busy.” You're making real progress! 🎯",
    ];
    return {
      text: quotes[Math.floor(Math.random() * quotes.length)]
    };
  }

  // Default personality fallback
  switch (character.personality) {
    case 'energetic':
      return {
        text: `I'm ${character.name}! Ask me about today's schedule, your next class, progress, or tomorrow's plans, and let's conquer the day! ⚡`
      };
    case 'funny':
      return {
        text: `Beep boop! My brain is stuffed with your schedules and a few dad jokes. Ask me what you have today or what to do next! 🍕`
      };
    case 'motivational':
      return {
        text: `I am right here to help you structure your path to greatness! Ask me about your next milestone or today's activities. 🌟`
      };
    case 'calm':
      return {
        text: `I'm here to gently guide you. Ask me about your schedule, next event, or how much you've accomplished today. 🍃`
      };
    case 'friendly':
    default:
      return {
        text: `Hi ${userName}! You can ask me things like "What do I have today?", "When is my next class?", or "Did I complete my tasks?". I'm happy to help! 😊`
      };
  }
};
