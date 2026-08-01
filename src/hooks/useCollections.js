import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

const MOCK_FALLBACKS = {
  movie: [
    {
      id: 'musicals',
      title: 'Musicals',
      items: [
        { id: 1, title: 'La La Land', poster_path: '/uDO8zWDhfNsNJeStJoi76ui3uSA.jpg', backdrop_path: '/kCdaNqb5Ui6LsAIvT6tFd435t3T.jpg', vote_average: 7.9, overview: 'Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail party gigs in dingy bars, but as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair.' },
        { id: 2, title: 'The Greatest Showman', poster_path: '/o9oEbrliB4vj7n3fhfs06j76H5R.jpg', backdrop_path: '/8y4vnGfMhYxX2K1J4f6F23G2Q7i.jpg', vote_average: 8.0, overview: 'The story of P.T. Barnum, a visionary who rose from nothing to create a mesmerizing spectacle that became a worldwide sensation.' },
        { id: 3, title: 'Les Misérables', poster_path: '/3e4aU3C8aZ8dGq390x10Zco28V2.jpg', backdrop_path: '/2r529w7FshkE1w85WJ5hR6UuW3v.jpg', vote_average: 7.3, overview: 'An adaptation of the successful stage musical based on Victor Hugo\'s classic novel, set in 19th-century France.' },
      ],
    },
    {
      id: 'marvel',
      title: 'Marvel',
      items: [
        { id: 4, title: 'Avengers: Endgame', poster_path: '/or0650h68GwmZlGheZsQCegXIyA.jpg', backdrop_path: '/7RyGg4iBBrsa70K7BLmSYS100kK.jpg', vote_average: 8.3, overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.' },
        { id: 5, title: 'Iron Man', poster_path: '/78lPOhuCjxy6tU36Uv5nhnV4v72.jpg', backdrop_path: '/7v5fb18j2bgw6z16h64EqWzsf7D.jpg', vote_average: 7.6, overview: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor.' },
        { id: 6, title: 'Spider-Man: No Way Home', poster_path: '/1g0dhIEaZ0BLFY7ehV26Vv14Vw2.jpg', backdrop_path: '/14a4459ICB55V3uSM6Jt2240afZ.jpg', vote_average: 8.0, overview: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.' },
      ],
    },
    {
      id: 'dc',
      title: 'DC',
      items: [
        { id: 7, title: 'Batman Begins', poster_path: '/854ss112cK8kgVamR38R33cwwrE.jpg', backdrop_path: '/zXJoz26s8mlnpG5sp26ZpYYbLI2.jpg', vote_average: 7.7, overview: 'Driven by tragedy, billionaire Bruce Wayne dedicates his life to fighting lawlessness in Gotham City as Batman.' },
        { id: 8, title: 'The Dark Knight', poster_path: '/qJ2tWw751O12w9y37wZrkCo1il8.jpg', backdrop_path: '/o7Gr59y37WzwvApe7812zs2n7JE.jpg', vote_average: 8.5, overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.' },
        { id: 9, title: 'The Dark Knight Rises', poster_path: '/hr0S0UwvNu6x2jWv5Q17M9sK4jV.jpg', backdrop_path: '/cu4u6v4n751M139G7864e292L.jpg', vote_average: 7.8, overview: 'Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent\'s crimes.' },
      ],
    },
    {
      id: 'johnwick',
      title: 'John Wick',
      items: [
        { id: 10, title: 'John Wick', poster_path: '/fqSRJ7t7v63Jj8p6e0o66cZgP6C.jpg', backdrop_path: '/k429oJ3oN5m42z9E1q8sVw4S6S6.jpg', vote_average: 7.4, overview: 'Ex-hitman John Wick comes out of retirement to track down the gangsters that took everything from him.' },
        { id: 11, title: 'John Wick: Chapter 2', poster_path: '/k50d9G4E22Sre7mD908lB2C79r7.jpg', backdrop_path: '/f5tQpY0f1D408e0K4n78hQW5O2F.jpg', vote_average: 7.3, overview: 'John Wick is forced out of retirement by a former associate plotting to seize control of a shadowy international assassins\' guild.' },
        { id: 12, title: 'John Wick: Chapter 3 - Parabellum', poster_path: '/ziEu0f6lh242ZkiBcES1VwIBEsG.jpg', backdrop_path: '/vVpEOvdxV62aVzIgaj36n7C9avb.jpg', vote_average: 7.4, overview: 'Super-assassin John Wick is on the run after killing a member of the international assassin\'s guild.' },
      ],
    },
    {
      id: 'godzilla',
      title: 'Godzilla',
      items: [
        { id: 13, title: 'Godzilla Minus One', poster_path: '/hkxxMIGaiC6v64oIMoIB074t0qq.jpg', backdrop_path: '/fYx6O11wG3v7qV51w6nS4Wz0T2P.jpg', vote_average: 7.6, overview: 'In late-1940s Japan, a devastated post-war nation faces a new threat in the form of a giant, mutated monster.' },
        { id: 14, title: 'Godzilla x Kong: The New Empire', poster_path: '/b4ebYg48CMjw4OS7TY4t687a46e.jpg', backdrop_path: '/j3Z3Xagmgy1j49stZg6OI2EUa5s.jpg', vote_average: 7.2, overview: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins.' },
        { id: 15, title: 'Godzilla', poster_path: '/lZ2YC87WvRP449ISKYgQzwbN04N.jpg', backdrop_path: '/yD71Ql6a646YwZzT37o9r0H8nN5.jpg', vote_average: 6.3, overview: 'The world is beset by the appearance of monstrous creatures, but one of them may be the only defense against the others.' },
      ],
    },
    {
      id: 'indianajones',
      title: 'Indiana Jones',
      items: [
        { id: 16, title: 'Raiders of the Lost Ark', poster_path: '/ceG7V8G1kFo29iIv2siC4Z7qj2F.jpg', backdrop_path: '/4ns5pU4L3dK24K21Zk4m38R3Zz.jpg', vote_average: 7.9, overview: 'Archeology professor Indiana Jones ventures to seize a biblical artifact known as the Ark of the Covenant.' },
        { id: 17, title: 'Indiana Jones and the Dial of Destiny', poster_path: '/34nO0Pz4Vw0xfi5V11CgDrq2j4n.jpg', backdrop_path: '/d5i8L58dK3V2eK3mZf48L4d63.jpg', vote_average: 6.7, overview: 'Finding himself in a new era, Indiana Jones struggles with fitting into a world that seems to have outgrown him.' },
        { id: 18, title: 'Indiana Jones and the Last Crusade', poster_path: '/4p15uR57UiMMQpqerCoIuJe8i9r.jpg', backdrop_path: '/2v5pY48dK5V3eK4mZf59L5d64.jpg', vote_average: 7.8, overview: 'Indiana Jones must search for his lost father who disappeared while seeking the Holy Grail.' },
      ],
    },
    {
      id: 'diehard',
      title: 'Die Hard',
      items: [
        { id: 19, title: 'Die Hard', poster_path: '/yLa7144Ndfg49n36g563vIi6W1g.jpg', backdrop_path: '/m3T1w5G63N0pQ58F7RzXjD03a2.jpg', vote_average: 7.8, overview: 'An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party.' },
        { id: 20, title: 'Die Hard 2', poster_path: '/yA0eJ8m4rZ5m9wWv4O4O4X3v5N.jpg', backdrop_path: '/k3T1w5G63N0pQ58F7RzXjD03a3.jpg', vote_average: 6.3, overview: 'John McClane must stop terrorists who have taken over the air traffic control system at Washington Dulles International Airport.' },
        { id: 21, title: 'Die Hard with a Vengeance', poster_path: '/c45m9wWv4O4O4X3v5N3Wf2D0.jpg', backdrop_path: '/p3T1w5G63N0pQ58F7RzXjD03a4.jpg', vote_average: 6.9, overview: 'John McClane and a Harlem store owner are targeted by a German terrorist in New York City.' },
      ],
    },
    {
      id: 'starwars',
      title: 'Star Wars',
      items: [
        { id: 22, title: 'Star Wars', poster_path: '/6FfCtAuVAW6XJjZ7e195T6FwZ2l.jpg', backdrop_path: '/nz8xWr2noJP5Urj06O9f2X7V01L.jpg', vote_average: 8.2, overview: 'Luke Skywalker joins forces with a Jedi Master, a cocky pilot, a Wookiee and two droids to save the galaxy.' },
        { id: 23, title: 'The Empire Strikes Back', poster_path: '/7uWV2Z4vWccUIXtxu1scHdfi52Z.jpg', backdrop_path: '/amY0a7FE7uGrytEvSg44v7uG1kK.jpg', vote_average: 8.4, overview: 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training.' },
        { id: 24, title: 'Return of the Jedi', poster_path: '/A65VE79W5e8v6H3pW0eS6pW81fG.jpg', backdrop_path: '/lKBm8d6P2uWJ7P83LzE1q8sW9fG.jpg', vote_average: 7.9, overview: 'After a daring mission to rescue Han Solo, the Rebels dispatch to Endor to destroy a second Death Star.' },
      ],
    },
    {
      id: 'thenun',
      title: 'The Nun',
      items: [
        { id: 25, title: 'The Nun', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz.jpg', backdrop_path: '/o2M6x8dK4Y0c7V5uY4L6e8W7Z2e.jpg', vote_average: 5.9, overview: 'A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate.' },
        { id: 26, title: 'The Nun II', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz2.jpg', backdrop_path: '/o2M6x8dK4Y0c7V5uY4L6e8W7Z2f.jpg', vote_average: 6.9, overview: 'In 1956 France, a priest is murdered, and Sister Irene once again comes face-to-face with the demonic force Valak.' },
        { id: 27, title: 'The Conjuring', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz3.jpg', backdrop_path: '/o2M6x8dK4Y0c7V5uY4L6e8W7Z2g.jpg', vote_average: 7.5, overview: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.' },
      ],
    },
    {
      id: 'insidious',
      title: 'Insidious',
      items: [
        { id: 28, title: 'Insidious', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz4.jpg', backdrop_path: '/o2M6x8dK4Y0c7V5uY4L6e8W7Z2h.jpg', vote_average: 6.9, overview: 'A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.' },
        { id: 29, title: 'Insidious: Chapter 2', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz5.jpg', backdrop_path: '/o2M6x8dK4Y0c7V5uY4L6e8W7Z2i.jpg', vote_average: 6.6, overview: 'The Lamberts believe they have defeated the spirits that haunted their family, but they soon discover that evil is not easily banished.' },
        { id: 30, title: 'Insidious: The Red Door', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz6.jpg', backdrop_path: '/o2M6x8dK4Y0c7V5uY4L6e8W7Z2j.jpg', vote_average: 6.1, overview: 'The Lambert family\'s terrifying saga comes to a head as Josh and a college-aged Dalton must go deeper into The Further than ever.' },
      ],
    },
  ],
  tv: [
    {
      id: 'anime',
      title: 'Anime',
      items: [
        { id: 101, name: 'Attack on Titan', poster_path: '/hTP1mN14L5tHnR190224aJ752hF.jpg', backdrop_path: '/i5QL4r5N0J5WwK2J2p3R1M7yGv.jpg', vote_average: 8.7, overview: 'Several hundred years ago, humans were nearly exterminated by Titans. Today, a teenager seeks vengeance.' },
        { id: 102, name: 'Demon Slayer', poster_path: '/h8Rb9gBr48g5guw2wep4OXYTSIg.jpg', backdrop_path: '/nTvMGCjSl55vJdJ4f6F23G2Q7i.jpg', vote_average: 8.6, overview: 'Tanjirou Kamado and his sister Nezuko search for a cure to Nezuko\'s demon curse.' },
        { id: 103, name: 'Death Note', poster_path: '/iigTJJskR1Pc20n8z54J4jNu4cE.jpg', backdrop_path: '/2r529w7FshkE1w85WJ5hR6UuW3v.jpg', vote_average: 8.6, overview: 'An intelligent high school student goes on a secret crusade to eliminate criminals after discovering a notebook.' },
      ],
    },
    {
      id: 'marvel_tv',
      title: 'Marvel',
      items: [
        { id: 104, name: 'Loki', poster_path: '/voHUml2f5Zm2kBHiICy3646l8jV.jpg', backdrop_path: '/a6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.2, overview: 'The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.' },
        { id: 105, name: 'WandaVision', poster_path: '/glKDfE6btIRXlU0V20iohgU2WvO.jpg', backdrop_path: '/b6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.7, overview: 'Blends the style of classic sitcoms with the Marvel Cinematic Universe in which Wanda Maximoff and Vision live their ideal suburban lives.' },
        { id: 106, name: 'Daredevil', poster_path: '/Qp7QeeG7uCs2w1g8XZ4nS8szmH.jpg', backdrop_path: '/c6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.1, overview: 'A blind lawyer by day, Matt Murdock fights crime at night on the streets of New York\'s Hell\'s Kitchen as Daredevil.' },
      ],
    },
    {
      id: 'dc_tv',
      title: 'DC',
      items: [
        { id: 107, name: 'The Flash', poster_path: '/lJA2R2m7tC3w0g0aljK2k0GE0Ty.jpg', backdrop_path: '/d6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.5, overview: 'After being struck by lightning, Barry Allen wakes up from his coma to discover he\'s been given the power of super speed.' },
        { id: 108, name: 'Arrow', poster_path: '/rh6618OthdoxC9x4aWw9n9P5V6L.jpg', backdrop_path: '/e6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.5, overview: 'Spoiled billionaire playboy Oliver Queen is missing and presumed dead for five years before being discovered alive on a remote island.' },
        { id: 109, name: 'Peacemaker', poster_path: '/hE3AhC4rjpgA9pj4O7iOPfgKN60.jpg', backdrop_path: '/f6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.3, overview: 'A companion series to The Suicide Squad, featuring Peacemaker as he fights for peace, no matter how many people he has to kill.' },
      ],
    },
    {
      id: 'scifi_tv',
      title: 'Sci-Fi',
      items: [
        { id: 110, name: 'Star Trek: Strange New Worlds', poster_path: '/95tLg4nEQ58u7vBf5FqE25xN66G.jpg', backdrop_path: '/g6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.1, overview: 'Follow Captain Christopher Pike, Science Officer Spock and Number One as they explore new worlds around the galaxy.' },
        { id: 111, name: 'Stranger Things', poster_path: '/49yOC3vV5w7j8H6n4wQQ4mc5qfS.jpg', backdrop_path: '/h6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.6, overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.' },
        { id: 112, name: 'The Mandalorian', poster_path: '/e3Ns97sn486Mkx1j77EdGrlA3v3.jpg', backdrop_path: '/i6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.4, overview: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.' },
      ],
    },
    {
      id: 'crime_tv',
      title: 'Crime',
      items: [
        { id: 113, name: 'Sherlock', poster_path: '/7rIPj7mlF1XqpocYEvp4LMJZZCc.jpg', backdrop_path: '/j6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.5, overview: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.' },
        { id: 114, name: 'Breaking Bad', poster_path: '/ztkUQVk6e932GOhmA753a2D56ns.jpg', backdrop_path: '/k6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.9, overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.' },
        { id: 115, name: 'Better Call Saul', poster_path: '/fuf2w6v9eMIYsa0j262RztA1ilC.jpg', backdrop_path: '/l6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.6, overview: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White.' },
      ],
    },
    {
      id: 'comedy_tv',
      title: 'Comedy',
      items: [
        { id: 116, name: 'Friends', poster_path: '/fqa5kLe4v6mZl18n3i7t5J53j2m.jpg', backdrop_path: '/m6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.4, overview: 'Helps you follow the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.' },
        { id: 117, name: 'The Office', poster_path: '/7Nu48BTJM6LV2hB687mVA7077as.jpg', backdrop_path: '/n6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.6, overview: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.' },
        { id: 118, name: 'Brooklyn Nine-Nine', poster_path: '/hg9W3fV8b70V3J3o6Y7e6xZ2oB2.jpg', backdrop_path: '/o6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.2, overview: 'A comedy series following the exploits of Detective Jake Peralta and his diverse, lovable colleagues at the NYPD\'s 99th Precinct.' },
      ],
    },
    {
      id: 'supernatural',
      title: 'Supernatural',
      items: [
        { id: 119, name: 'Supernatural', poster_path: '/uo53o0QjLgpy3v8u9CgWjWjgV5W.jpg', backdrop_path: '/p6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.3, overview: 'Two brothers follow their father\'s footsteps as "hunters," fighting evil supernatural beings of many kinds.' },
        { id: 120, name: 'The Winchesters', poster_path: '/fS4c9nK2gJ9py3v8u9CgWjWjgV5X.jpg', backdrop_path: '/q6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.2, overview: 'A supernatural drama following the epic love story of John and Mary Winchester and their quest to save their fathers and the world.' },
        { id: 121, name: 'Legacies', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz7.jpg', backdrop_path: '/r6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.9, overview: 'Hope Mikaelson, a tribrid daughter of a Vampire/Werewolf hybrid, attends the Salvatore School for the Young and Gifted.' },
      ],
    },
    {
      id: 'friends',
      title: 'Friends',
      items: [
        { id: 122, name: 'Friends', poster_path: '/fqa5kLe4v6mZl18n3i7t5J53j2m.jpg', backdrop_path: '/m6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.4, overview: 'Helps you follow the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.' },
        { id: 123, name: 'Joey', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz8.jpg', backdrop_path: '/s6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 6.1, overview: 'Joey Tribbiani moves to Los Angeles to pursue his acting career full time, reuniting with his sister and nephew.' },
        { id: 124, name: 'Episodes', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz9.jpg', backdrop_path: '/t6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.1, overview: 'British comedy creators Sean and Beverly Lincoln travel to Hollywood to remake their hit series for an American audience.' },
      ],
    },
    {
      id: 'got',
      title: 'Game of Thrones',
      items: [
        { id: 125, name: 'Game of Thrones', poster_path: '/7WUH46L221uf3dSNX0L6p6Lw6o.jpg', backdrop_path: '/u6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.4, overview: 'Seven noble families fight for control of the mythical land of Westeros, while an ancient enemy returns.' },
        { id: 126, name: 'House of the Dragon', poster_path: '/1XS1mLi676Jv4v8l47yWjgW4C4.jpg', backdrop_path: '/v6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.5, overview: 'The Targaryen dynasty is at the absolute apex of its power, with more than 10 dragons under their control.' },
        { id: 127, name: 'Rome', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz10.jpg', backdrop_path: '/w6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.3, overview: 'A down-to-earth look at the lives of two ordinary Roman soldiers during the fall of the Republic and rise of the Empire.' },
      ],
    },
    {
      id: 'breakingbad',
      title: 'Breaking Bad',
      items: [
        { id: 128, name: 'Breaking Bad', poster_path: '/ztkUQVk6e932GOhmA753a2D56ns.jpg', backdrop_path: '/x6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.9, overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.' },
        { id: 129, name: 'Better Call Saul', poster_path: '/fuf2w6v9eMIYsa0j262RztA1ilC.jpg', backdrop_path: '/y6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 8.6, overview: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White.' },
        { id: 130, name: 'El Camino', poster_path: '/zs6gozs20K1y7e9Pz9Pz9Pz9Pz11.jpg', backdrop_path: '/z6tBz5D0z5WwK2J2p3R1M7yGv.jpg', vote_average: 7.1, overview: 'In the wake of his dramatic escape from captivity, Jesse Pinkman must come to terms with his past.' },
      ],
    },
  ],
};

export function useCollections(mediaType, collectionsList) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ data: [], loading: true, error: null });

    async function load() {
      try {
        const promises = collectionsList.map(async (col) => {
          let results = [];
          try {
            if (col.type === 'genre') {
              const res = await tmdb.discover(mediaType, { with_genres: col.value });
              results = res.results || [];
            } else if (col.type === 'search') {
              const res = await tmdb.search(mediaType, col.value);
              results = res.results || [];
            }
          } catch (apiErr) {
            console.warn(`TMDB collection API fetch failed for ${col.title}:`, apiErr);
          }

          // Filter out items without posters
          let filtered = results.filter((item) => item.poster_path).slice(0, 3);

          // If fetch returned no results or failed, fall back to our local fallback for this collection
          if (filtered.length < 3) {
            const fallbackCol = MOCK_FALLBACKS[mediaType]?.find((f) => f.id === col.id);
            if (fallbackCol) {
              filtered = fallbackCol.items;
            }
          }

          return {
            id: col.id,
            title: col.title,
            items: filtered,
          };
        });

        const fetched = await Promise.all(promises);
        if (cancelled) return;
        setState({ data: fetched, loading: false, error: null });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        if (cancelled) return;
        // Global error: load all fallbacks for the selected mediaType as complete fallback
        const fallbackData = MOCK_FALLBACKS[mediaType] || [];
        setState({ data: fallbackData, loading: false, error: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mediaType, collectionsList]);

  return state;
}
