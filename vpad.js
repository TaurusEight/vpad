
// Time-stamp: <2016-11-05 22:13:22 daniel>  -*- mode: js; -*-
// Written by Daniel Mendyke [archadious@gmail.com]


// force complience with absolute standard
//-----------------------------------------------------------------------------
"use strict";


// Return the DOM object associated with the passed selector
// or throw an excpetion.  Return the dom element.
//-----------------------------------------------------------------------------
var QuerySelector = function( selector ) {

	//console.log( `QuerySelector ${selector}` );
	let element = document.querySelector( selector );
	if ( element === null ) 
		throw new Error( `ERROR - Bad selector: ${selector}` );
	return element;

};  // end QuerySelector


// Wrapper the form submit button to allow for ease of disable and enable
//-----------------------------------------------------------------------------
class SubmitButton {

	// Initial the submit button
	constructor( ) {
		this.handle = QuerySelector( 'article form input[type=submit]' );
		this.turnOff();  // turn off the button to start with
	}  // end constructor

	// Turn on the submit button
	turnOn() {
		this.handle.disabled = false;
	}  // end turnOn

	// Turn off the submit button
	turnOff() {
		this.handle.disabled = true;
	}  // end turnOff

};  // end class SubmitButton


// Wrapper around the Text Input field - ease adding and deleting characters
//-----------------------------------------------------------------------------
class TextInput {

	// Initialize the text input field
	constructor( ) {
		this.handle = QuerySelector( 'article form input[type=text]' );
		this.maxLength = 15;  // max length of the text
	}  // end constructor

	// add a character
	add( character ) {
		if ( this.handle.value.length  < this.maxLength )
		this.handle.value += character;
	}  // end add

	// delete the trailing character
	// Pass in the submit button and disable it if text is zero length
	del( submitButton ) {
		let value = this.handle.value;  // short hand to the value
		if ( value.length === 0 ) return;
		this.handle.value = value.substring( 0, value.length - 1 );
		if ( this.handle.value.length === 0 )
			submitButton.turnOff();
	}  // end del

	// Return the input constrol value reversed
	reverse( ) {
		let result = "";  // empty string
		let length = this.handle.value.length;  // short hand
		if ( length === 0 )
			throw Error( 'ERROR - Can not reverse an empty string!' );
		for ( let iter = length - 1; iter >= 0; iter-- )
		{
			result += this.handle.value[ iter ]
		};  // end for loop
		return result;
	}  // end reverse

}  // end class TextInput


// Wrapper around the form on the page.
// Handles clicking the submit button and displays the reversed data
// in the inpute text field.
//-----------------------------------------------------------------------------
class ReverseForm {

	// Initial the form
	constructor( ) {
	    this.handle = QuerySelector( 'article form' );
		this.handle.addEventListener( 'submit', this.submit.bind( this ) );
		this.submitButton = new SubmitButton();
		this.textInput = new TextInput();
	}  // end constructor

	// handle the user having clicked the submit button
	submit( event ) {
		event.preventDefault();  // stop system from propagaing the event
		alert( this.textInput.reverse() );
	}  // end submit

	// Add character to the input field
	addCharacter( character ) {
		this.textInput.add( character );
		this.submitButton.turnOn();
	}  // end addCharacter

	// Remove a character from the text input
	delCharacter( ) {
		this.textInput.del( this.submitButton );
	}  // end delCharacter

};  // end ReverseForm


// Wrapper around each button on the virtual pad
//-----------------------------------------------------------------------------
class PadButton {

	// Initialize the pad button
	constructor( form, value ) {
		this.form = form;  // save pointer to parent pad
		this.value = value;  // save the value on the button
		this.handle = QuerySelector( `#${value}` );
		this.handle.addEventListener( 'click', this.click.bind( this ) );
	}  // end constructor

	// The button has been clicked
	click( event ) {
		this.form.addCharacter( this.value );  // value of this button
	}  // end click

	// shift the state of this button and the value it returns
	shift( state ) {
		if ( state === 'lower' )
			this.toggle( this.value.toLowerCase() );
		else
			this.toggle( this.value.toUpperCase() );
	}  // end shift

	// Toggle between upper and lower case
	toggle( value ) {
		this.value = value;
		this.handle.innerHTML = this.value;
	}  // end toggle

};  // end PadButton


// Wrapper around the 'shift' key
//-----------------------------------------------------------------------------
class ShiftButton extends PadButton {

	// Initialize this button
	constructor( form, pad ) {
		super( form, 'shf' );
		this.pad = pad;  // pointer back to parent pad
		this.state = 'lower';  // toggle between 'lower' and 'upper'
	}  // end constructor

	// over-ride the click action on this button
	click( event ) {
		this.state = this.state === 'lower' ? 'upper' : 'lower';
		this.pad.shiftButtons( this.state );
	}  // end click

};  // end class ShiftButton


// Wrapper around the 'del' key
//-----------------------------------------------------------------------------
class DelButton extends PadButton {

	// Initialize this button
	constructor( form ) {
		super( form, 'del' );
	}  // end constructor

	// over-ride the click action on this button
	click( event ) {
		this.form.delCharacter();  // remove a character
	}  // end click

	// Over ride parent function
	shift( state ) { return; }  // end shift

};  // end class ShiftButton


// Wrapper around the virtual keypad
//-----------------------------------------------------------------------------
class Pad {

	// Initialize the Pad
	constructor( form ) {
		this.button = [];  // array of buttons
		this.buildButtons( form );  // create the virtual buttons
	}  // end constructor

	// Create each button
	buildButtons( form ) {
		let selectors = "abcdefghij";
		for ( let iter = 0; iter < selectors.length; ++iter )
		{
			this.button.push( new PadButton( form, selectors[ iter ] ) );
		};  // end for loop
		this.button.push( new ShiftButton( form, this ) );
		this.button.push( new DelButton( form ) );
	}  // end buildButtons

	// Shift the pad buttons
	shiftButtons( state ) {
		this.button.forEach( ( button ) => { button.shift( state ); } );
	}  // end shiftCharacters

};  // end class Pad


// Main object of this class
//-----------------------------------------------------------------------------
class Application {

	// Initialize object
	constructor( ) {
		this.form = new ReverseForm();
		this.pad = new Pad( this.form );
	}  // end constructor


	// begin the functions of this object
	main( ) {
	}  // end main


};  // end class Application


// Entry into application
//-----------------------------------------------------------------------------
try
{
	new Application().main();
}
catch( error )
{
	console.log( error.message );
};  // end try / catch
