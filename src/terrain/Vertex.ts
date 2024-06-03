import perlinNoise from './PerlinNoise';

const terrainVertex = /*glsl*/ `
    ${perlinNoise}

    uniform float time;
    varying vec2 vUv;
    varying vec3 vPos;

    float valleyAmplitude = -0.4;
    float valleyFalloff = -0.0000009;
    float valleyDist(float x) {
        return exp(valleyFalloff * pow(x / valleyAmplitude, 2.)) / 
            (valleyAmplitude * sqrt(2. * radians(180.))) + 1.;
    }
    
    vec3 scale = vec3(200., 200., 40.);
    vec3 smoothing = vec3(1000., 400., 90.);
    void main() {
        vec2 tPos = vec2(position.x, position.y + time * 100.);
        vec3 layers = vec3(
            snoise(tPos / smoothing.xx), 
            snoise(tPos / smoothing.yy), 
            snoise(tPos / smoothing.zz));
        layers *= scale;
        float height = valleyDist(position.x) * (layers.x + layers.y + layers.z + 300.);
        vec4 modelPosition = modelMatrix * vec4(position.xy, height, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
        // vPos = position;
        vPos = vec3(uv, 0.0);
    }
`;

export default terrainVertex;
