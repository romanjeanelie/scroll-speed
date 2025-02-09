  #ifdef GL_ES
    precision mediump float;
    #endif
    
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    uniform float uTime;
    uniform float uScale;
    uniform float uScale2;
    
    uniform sampler2D uSampler0;
    
    void main() {
		float scale = 1.5;
        vec2 textureCoord = (vTextureCoord - 0.5) / ((uScale + uScale2) * 0.5) + 0.5 ;
       
	    gl_FragColor = texture2D(uSampler0, textureCoord);
    }