export const isMail = (text) => {
	let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
	return reg.test(text)
}
export const isPwdValid = (text) => {
	return text.length > 6
}