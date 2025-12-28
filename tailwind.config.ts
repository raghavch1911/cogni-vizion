import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					border: 'hsl(var(--card-border))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg) scale(1)', 
						filter: 'hue-rotate(0deg)'
					},
					'33%': { 
						transform: 'translateY(-15px) rotate(3deg) scale(1.02)', 
						filter: 'hue-rotate(60deg)'
					},
					'66%': { 
						transform: 'translateY(-25px) rotate(-2deg) scale(0.98)', 
						filter: 'hue-rotate(120deg)'
					}
				},
				'pulse-glow': {
					'0%': { 
						boxShadow: '0 0 20px hsla(var(--primary), 0.3), inset 0 0 20px hsla(var(--primary), 0.1)'
					},
					'50%': { 
						boxShadow: '0 0 60px hsla(var(--primary), 0.8), 0 0 100px hsla(var(--secondary), 0.4), 0 0 140px hsla(var(--accent), 0.2), inset 0 0 30px hsla(var(--primary), 0.2)'
					},
					'100%': { 
						boxShadow: '0 0 40px hsla(var(--secondary), 0.6), 0 0 80px hsla(var(--accent), 0.3), inset 0 0 25px hsla(var(--secondary), 0.15)'
					}
				},
				'neural-pulse': {
					'0%, 100%': { opacity: '0.6', transform: 'scale(1) rotateZ(0deg)', filter: 'brightness(1) saturate(1)' },
					'25%': { opacity: '0.8', transform: 'scale(1.03) rotateZ(1deg)', filter: 'brightness(1.1) saturate(1.2)' },
					'50%': { opacity: '1', transform: 'scale(1.08) rotateZ(0deg)', filter: 'brightness(1.3) saturate(1.4)' },
					'75%': { opacity: '0.9', transform: 'scale(1.05) rotateZ(-1deg)', filter: 'brightness(1.2) saturate(1.3)' }
				},
				'particle-flow': {
					'0%': { transform: 'translateX(-200px) translateY(0px) scale(0)', opacity: '0', filter: 'hue-rotate(0deg)' },
					'10%': { transform: 'translateX(-150px) translateY(-20px) scale(0.5)', opacity: '0.3', filter: 'hue-rotate(45deg)' },
					'50%': { transform: 'translateX(50vw) translateY(-30px) scale(1)', opacity: '1', filter: 'hue-rotate(180deg)' },
					'90%': { transform: 'translateX(calc(100vw - 50px)) translateY(-60px) scale(0.8)', opacity: '0.4', filter: 'hue-rotate(270deg)' },
					'100%': { transform: 'translateX(calc(100vw + 50px)) translateY(-80px) scale(0)', opacity: '0', filter: 'hue-rotate(360deg)' }
				},
				'brain-scan': {
					'0%': { clipPath: 'inset(100% 0 0 0)', filter: 'brightness(0.7) contrast(1.2)' },
					'50%': { clipPath: 'inset(50% 0 0 0)', filter: 'brightness(1.2) contrast(1.4)' },
					'100%': { clipPath: 'inset(0 0 0 0)', filter: 'brightness(1) contrast(1)' }
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100vh) rotateX(0deg)', opacity: '0' },
					'10%': { opacity: '0.7' },
					'90%': { opacity: '0.7' },
					'100%': { transform: 'translateY(100vh) rotateX(360deg)', opacity: '0' }
				},
				'hologram-flicker': {
					'0%, 100%': { opacity: '1', filter: 'brightness(1) hue-rotate(0deg)' },
					'2%': { opacity: '0.8', filter: 'brightness(1.2) hue-rotate(10deg)' },
					'4%': { opacity: '0.9', filter: 'brightness(0.9) hue-rotate(-5deg)' },
					'6%': { opacity: '1', filter: 'brightness(1.1) hue-rotate(15deg)' },
					'8%': { opacity: '0.85', filter: 'brightness(1) hue-rotate(0deg)' }
				},
				'data-stream': {
					'0%': { transform: 'scaleX(0) translateX(-50px)', opacity: '0' },
					'20%': { transform: 'scaleX(0.2) translateX(-30px)', opacity: '0.6' },
					'50%': { transform: 'scaleX(1) translateX(0px)', opacity: '1' },
					'80%': { transform: 'scaleX(0.7) translateX(20px)', opacity: '0.8' },
					'100%': { transform: 'scaleX(0) translateX(50px)', opacity: '0' }
				},
				'neural-network': {
					'0%': { strokeDasharray: '0 100', strokeDashoffset: '0' },
					'50%': { strokeDasharray: '50 50', strokeDashoffset: '-25' },
					'100%': { strokeDasharray: '100 0', strokeDashoffset: '-100' }
				},
				'morphing-glow': {
					'0%': { borderRadius: '50% 30% 70% 40%', background: 'radial-gradient(circle, hsla(var(--primary), 0.3) 0%, transparent 70%)' },
					'25%': { borderRadius: '30% 60% 40% 70%', background: 'radial-gradient(ellipse, hsla(var(--secondary), 0.4) 0%, transparent 70%)' },
					'50%': { borderRadius: '70% 40% 50% 30%', background: 'radial-gradient(circle, hsla(var(--accent), 0.35) 0%, transparent 70%)' },
					'75%': { borderRadius: '40% 70% 30% 60%', background: 'radial-gradient(ellipse, hsla(var(--primary), 0.4) 0%, transparent 70%)' },
					'100%': { borderRadius: '50% 30% 70% 40%', background: 'radial-gradient(circle, hsla(var(--primary), 0.3) 0%, transparent 70%)' }
				},
				'quantum-field': {
					'0%, 100%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%', filter: 'hue-rotate(0deg) brightness(1)' },
					'33%': { backgroundPosition: '100% 0%, 0% 100%, 25% 75%', filter: 'hue-rotate(120deg) brightness(1.1)' },
					'66%': { backgroundPosition: '100% 100%, 0% 0%, 75% 25%', filter: 'hue-rotate(240deg) brightness(0.9)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 8s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite alternate',
				'neural-pulse': 'neural-pulse 4s ease-in-out infinite',
				'particle-flow': 'particle-flow 12s linear infinite',
				'brain-scan': 'brain-scan 2s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 15s linear infinite',
				'hologram-flicker': 'hologram-flicker 2s ease-in-out infinite',
				'data-stream': 'data-stream 1.5s ease-in-out infinite',
				'neural-network': 'neural-network 3s ease-in-out infinite',
				'morphing-glow': 'morphing-glow 8s ease-in-out infinite',
				'quantum-field': 'quantum-field 20s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
