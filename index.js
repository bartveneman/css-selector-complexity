const {CssSelectorParser} = require('css-selector-parser')

const parser = new CssSelectorParser()
parser.registerNestingOperators('>', '+', '~')
parser.registerAttrEqualityMods('^', '$', '*', '~', '|')
parser.registerSelectorPseudos('not')

const complexity = selector => {
	if (typeof selector !== 'string' || selector.trim() === '') {
		throw new Error(
			`selector must be a string, got ${typeof selector} (${JSON.stringify(
				selector
			)})`
		)
	}

	let rule
	// Catch any broken CSS selector (see tests)
	try {
		rule = parser.parse(selector)
	} catch (error) {
		throw new Error(
			`Invalid selector. Check the syntax validity of '${selector}'`
		)
	}

	let total = 0

	while ((rule = rule.rule)) {
		if (rule.tagName && rule.tagName !== '*') {
			total += 1
		}

		if (rule.id) {
			total += 1
		}

		if (rule.classNames) {
			total += rule.classNames.length
		}

		if (rule.attrs) {
			total += rule.attrs
				.map(attr => (attr.value ? 2 : 1))
				.reduce((total, attributeCount) => total + attributeCount)
		}

		if (rule.pseudos) {
			total += rule.pseudos
				.filter(pseudo => pseudo.name !== '')
				.map(pseudo =>
					pseudo.name === 'not' ? complexity(parser.render(pseudo.value)) : 1
				)
				.reduce((total, pseudoCount) => total + pseudoCount)
		}
	}

	return total
}

module.exports = complexity
