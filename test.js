const test = require('ava')
const complexity = require('.')

test('it only expects strings', t => {
	t.throws(() => complexity(1))
	t.throws(() => complexity(null))
	t.throws(() => complexity(undefined))
	t.throws(() => complexity([]))
	t.throws(() => complexity(''))
})

test('it calculates simple selectors', t => {
	const provider = [
		[1, '.class'],
		[1, 'element'],
		[1, '#id'],
		[0, '*'],
		[0, '* + *']
	]

	provider.forEach(([expected, selector]) => {
		const actual = complexity(selector)
		t.is(
			actual,
			expected,
			`Expected ${selector} to have complexity of ${expected}, found ${actual}`
		)
	})
})

test('it calculates combined selectors', t => {
	const provider = [
		[3, '.class .within .class'],
		[2, 'ul > li'],
		[2, 'dt ~ dd'],
		[2, 'h1 + p'],
		[2, 'test#me'],
		[2, '#id.class'],
		[4, '.class#id[attribute=value]']
	]

	provider.forEach(([expected, selector]) => {
		const actual = complexity(selector)
		t.is(
			actual,
			expected,
			`Expected ${selector} to have complexity of ${expected}, found ${actual}`
		)
	})
})

test('it calculates pseudo selectors', t => {
	const provider = [
		[2, 'p:first-child'],
		[2, 'a :only-child'],
		[2, 'li:nth-child(2n+1)'],
		[2, 'p::first-letter'],
		[3, 'p:first-child::first-letter'],
		[3, 'a:matches(.class) b'],
		[2, '.className:nth-child(-n+3)'],
		[1, ':nth-child(7n+1)'],
		[2, 'a:not(test)'],
		[2, 'a:not(:nth-child(7n+1))'],
		[2, 'input:not(:valid)']
	]

	provider.forEach(([expected, selector]) => {
		const actual = complexity(selector)
		t.is(
			actual,
			expected,
			`Expected ${selector} to have complexity of ${expected}, found ${actual}`
		)
	})
})

test('it calculates attribute selectors', t => {
	const provider = [
		// 6.3.1 Attribute presence and value selectors
		[1, '[aria-hidden]'],
		[2, '[property="value"]'],
		[2, '[property|="value"]'],
		[2, '[property~="value"]'],
		// 6.3.2 Substring matching attribute selectors
		[2, '[property^="value"]'],
		[2, '[property$="value"]'],
		[2, '[property*="value"]'],
		// Misc.
		[3, '[property][property="value"]']
	]

	provider.forEach(([expected, selector]) => {
		const actual = complexity(selector)
		t.is(
			actual,
			expected,
			`Expected ${selector} to have complexity of ${expected}, found ${actual}`
		)
	})
})

test('it throws an error on invalid selectors', t => {
	const provider = [
		'.toolbar_15a35>', // Producthunt example
		'+.box-group>li', // Bol.com example
		'.w-(20: 20%' // Trello example
	]

	provider.forEach(selector => {
		t.throws(() => complexity(selector))
	})
})

test('it calculates insane real-world cases', t => {
	const provider = [
		[
			14,
			'.bx--side-nav--website--light .bx--side-nav__menu[role=menu] a.bx--side-nav__link[role=menuitem]:not(.bx--side-nav__link--current):not([aria-current=page]):hover .bx--side-nav__icon svg'
		],
		[
			8,
			'.dashboard-membership__desc.for-supporters li.for-members.for-smashing:not(.for-supporters) time::after'
		],
		[
			10,
			'body:not(.woocommerce-page):not(.page-template-page-search-results) .overflow-table-wrap>table.overflow-table:not(.gsc-table-result):not(.gcsc-branding):not(.gsc-resultsHeader) table'
		],
		[
			14,
			'body.dropdown-available[data-navigation="dropdown"] .devsite-doc-set-nav-tab-container:nth-child(6) .devsite-dropdown-menu-column:nth-child(1) .devsite-nav-item:nth-child(3) a.devsite-nav-title span::after'
		]
	]

	provider.forEach(([expected, selector]) => {
		const actual = complexity(selector)
		t.is(
			actual,
			expected,
			`Expected ${selector} to have complexity of ${expected}, found ${actual}`
		)
	})
})
