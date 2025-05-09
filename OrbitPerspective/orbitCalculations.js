// Converts Keplerian elements to Cartesian coordinates
// a_au: semi-major axis (in AU)
// e: eccentricity
// M: mean anomaly (radians)
// Depends on: AU (from config.js)
function keplerToCartesian(a_au, e, M) {
    const a = a_au * AU; // semi-major axis in pixels

    // Solve Kepler's equation M = E - e * sin(E) for E (eccentric anomaly) using Newton's method
    let E_approx = M; // Initial guess for Eccentric Anomaly
    for (let i = 0; i < 10; i++) { // Iterate a few times for precision
        E_approx = E_approx - (E_approx - e * Math.sin(E_approx) - M) / (1 - e * Math.cos(E_approx));
    }

    // Calculate true anomaly (nu) from eccentric anomaly (E_approx)
    const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E_approx / 2), Math.sqrt(1 - e) * Math.cos(E_approx / 2));

    // Calculate distance to sun (r)
    const r = a * (1 - e * Math.cos(E_approx));

    // Cartesian coordinates in the orbital plane (x pointing to perihelion)
    const x_orb = r * Math.cos(nu);
    const y_orb = r * Math.sin(nu);

    return { x: x_orb, y: y_orb };
}
