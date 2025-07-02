/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/tailwind-datepicker-react/dist/**/*.js', // <--- Add this line
	],
	theme: {
		extend: {
			colors: {
				custom: {
					'1.0': '#C0392B',
					'79.0': '#CD6155',
					'59.0': '#D98880',
					'39.0': '#E6B0AA',
					'19.0': '#F9EBEA',
					'0.0': '#E9F7EF',
					'20.0': '#D4EFDF',
					'40.0': '#7DCEA0',
					'60.0': '#52BE80',
					'80.0': '#27AE60',
				},
			},
		},
	},
};
