const AU = 50; // pixels per AU for drawing
const LOG_COMPRESSION_FACTOR = 100; // Adjust for desired log scaling effect. In pixels.
const M_SUN = 1.989e30; // Mass of the Sun in kg (Note: G and M_SUN are not directly used in Keplerian model but kept for potential future use)
const G = 6.67430e-11; // Gravitational constant

const INITIAL_TIME_SPEED = 2 * 604800; // Default: 2 weeks of sim time per real second (604800 seconds in a week)
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

const PLANET_DATA = {
    sun: { name: 'Sun', radius: 15, color: 'yellow', orbitalRadiusAU: 0, periodDays: 0, eccentricity: 0, massKg: M_SUN, isStar: true },
    mercury: { name: 'Mercury', radius: 2, color: 'gray', orbitalRadiusAU: 0.387, periodDays: 88, eccentricity: 0.206, massKg: 0.330e24 },
    venus: { name: 'Venus', radius: 4, color: 'orange', orbitalRadiusAU: 0.723, periodDays: 224.7, eccentricity: 0.007, massKg: 4.87e24 },
    earth: { name: 'Earth', radius: 5, color: 'blue', orbitalRadiusAU: 1, periodDays: 365.25, eccentricity: 0.017, massKg: 5.97e24 },
    mars: { name: 'Mars', radius: 3, color: 'red', orbitalRadiusAU: 1.524, periodDays: 687, eccentricity: 0.093, massKg: 0.642e24 },
    jupiter: { name: 'Jupiter', radius: 10, color: 'sienna', orbitalRadiusAU: 5.203, periodDays: 4333, eccentricity: 0.048, massKg: 1898e24 },
    saturn: { name: 'Saturn', radius: 9, color: 'khaki', orbitalRadiusAU: 9.537, periodDays: 10759, eccentricity: 0.054, massKg: 568e24, rings: true },
    uranus: { name: 'Uranus', radius: 7, color: 'lightblue', orbitalRadiusAU: 19.191, periodDays: 30687, eccentricity: 0.047, massKg: 86.8e24 },
    neptune: { name: 'Neptune', radius: 7, color: 'darkblue', orbitalRadiusAU: 30.069, periodDays: 60190, eccentricity: 0.009, massKg: 102e24 },
    pluto: { name: 'Pluto', radius: 1, color: 'tan', orbitalRadiusAU: 39.482, periodDays: 90560, eccentricity: 0.249, massKg: 1.303e22 }
};
