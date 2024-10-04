const terrainFragment = /*glsl*/ `
    uniform float time;
    // uniform vec3 directionalLightColor[ 1 ];
    // uniform vec3 directionalLightDirection[ 1 ];
    // uniform vec2 resolution;
    // uniform vec2 pointer;
    varying vec2 vUv;      
    varying vec3 vPos;

    vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
    }

    vec2 gridSize = vec2(1000., 1000.);
    vec2 gridPitch  = vec2(10., 5.);
    vec2 gridThickness = vec2(1., 0.5);
    void main() {
        vec2 gridPos = mod(vec2(vPos.x, vPos.y + (time / 30.)) * gridSize, gridPitch);
        vec2 inGrid = any(lessThan(gridPos, gridThickness)) ? vec2(1.0, 1.0) : vec2(0.0, 1.0);
        vec3 color = palette(vUv.y + time / 30.);
        gl_FragColor = vec4(color.rb, 1., 1.0) * inGrid.xxxy;
        // vec3 color = palette(vUv.y + time / 40.);
        // gl_FragColor = vec4(color.br, .6, 1. );
    }
`;
export default terrainFragment;
