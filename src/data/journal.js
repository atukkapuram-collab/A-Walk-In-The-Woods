// The Trail Journal (docs/story.md, The Trail Journal; design blueprint,
// Journal screen): Bryson's history and nature asides as 13 short entries.
// Each is 2-3 sentences, paraphrased from the book (never quoted at length),
// with the chapter it comes from.
//
// Entries unlock from map signs and overlooks (`journal: id` on the sign) and
// from event steps ({ journal: id }, e.g. E9's Centralia option). Found
// entries are kept between walks (src/state/persistence.js), and the ending
// card counts the ones found on this walk.
//
// Entries 1-10 written in Milestone 11 and 11-12 in Milestone 12 (new writing,
// paraphrasing the book; the owner checks the facts, especially those marked
// verify), and 13 in Milestone 13.

export const JOURNAL = [
    {
        id: 'blazes', title: 'White Blazes', chapter: 'Chapter 1',
        text: 'The trail is marked by white paint blazes, about two inches by six, on trees and rocks all the way from Georgia to Maine. It runs to more than 2,100 miles, and its length shifts a little every year as sections are rerouted.'
    },
    {
        id: 'bears', title: 'Bear Attacks', chapter: 'Chapter 1',
        text: 'Before setting out, Bryson read books about bear attacks, which he came to regret. The black bears of the Appalachians very rarely hurt anyone. But rarely is not never, and the books lingered on the exceptions.'
    },
    {
        id: 'mackaye', title: 'Benton MacKaye', chapter: 'Chapter 3',
        text: 'The trail was first proposed in 1921 by Benton MacKaye, a forester and planner, as a footpath along the Appalachian ridges with camps and communities along the way. Most of his grand plan never happened. The path did.'
    },
    {
        id: 'avery', title: 'Myron Avery', chapter: 'Chapter 3',
        text: "Myron Avery, a lawyer from Maine, turned MacKaye's idea into an actual trail. He walked and measured it with a wheel, drove the volunteers who built it, and quarrelled with nearly everyone. It was finished in 1937."
    },
    {
        id: 'firs', title: 'The Fraser Firs', chapter: 'Chapter 6',
        text: "In the Smokies, Bryson walks through stands of dead Fraser firs, killed by a tiny insect brought over from Europe by accident. He is angry at how little was done to save them, and at the Park Service's priorities."
    },
    {
        id: 'gatlinburg', title: 'Gatlinburg', chapter: 'Chapter 7',
        text: 'Gatlinburg sits at the edge of the Great Smoky Mountains National Park. Bryson finds it a gaudy, baffling place, all souvenir shops and pancake houses, a short walk from some of the wildest country in the East.'
    },
    {
        id: 'shaffer', title: 'Earl Shaffer, 1948', chapter: 'Chapter 9',
        text: 'In 1948 Earl Shaffer, a veteran just home from the Second World War, became the first person to walk the whole trail in a single season. At first, some people refused to believe he had done it.'
    },
    {
        // (verify) which Durand painting the chapter describes.
        id: 'durand', title: 'Durand and the Lost Forest', chapter: 'Chapter 10',
        text: "Bryson describes a painting by Asher Brown Durand of a wild, ancient American forest. That forest, he points out, is almost all gone: very little of the East's original woodland survived the axe."
    },
    {
        id: 'chestnut', title: 'The Chestnut Blight', chapter: 'Chapter (verify)',
        text: 'The American chestnut was once one of the commonest trees in the eastern woods. Early in the 1900s a fungus from Asia began killing them, and within a few decades almost every grown chestnut in America was dead.'
    },
    {
        id: 'shenandoah', title: "Shenandoah's Mountain Families", chapter: 'Chapter (verify)',
        text: 'To make Shenandoah National Park in the 1930s, the government moved out the families who lived in the hills, many against their will. Bryson notes how little of their story the park chooses to tell.'
    },
    {
        id: 'centralia', title: 'Centralia', chapter: 'Chapter (verify)',
        text: 'Centralia, Pennsylvania, sat on a seam of coal that caught fire in 1962 and has burned underground ever since. Smoke rose through the streets, the ground sagged, and nearly everyone was moved away.'
    },
    {
        id: 'washington', title: "Mount Washington's Weather", chapter: 'Chapter (verify)',
        text: 'Mount Washington has some of the worst weather on Earth: in 1934 a wind of 231 miles an hour was measured at its summit. More than a hundred people have died on its slopes, many of them in summer.'
    },
    {
        id: 'wilderness', title: 'The Hundred-Mile Wilderness', chapter: 'Chapter 19',
        text: 'The Hundred-Mile Wilderness in Maine is the most remote stretch of the whole trail: a hundred miles of forest, bog and lake with no towns, no shops and only logging roads. Hikers are told to carry food for ten days.'
    }
];

export const JOURNAL_BY_ID = Object.fromEntries(JOURNAL.map((entry) => [entry.id, entry]));
export const JOURNAL_TOTAL = JOURNAL.length;
