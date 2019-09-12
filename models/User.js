class User {

    constructor(UserId, password, firstName, lastName, emailAddress, address1, address2, city, state, zipCode, country) {
        this._UserId = UserId;
        this._password = password,
        this._firstName = firstName;
        this._lastName = lastName;
        this._emailAddress = emailAddress;
        this._address1 = address1;
        this._address2 = address2;
        this._city = city;
        this._state = state;
        this._zipCode = zipCode;
        this._country = country;
        this._password = password;
    }

    /**
     *
     * Getter and Setters
     */


    get UserId() {
        return this._UserId;
    }

    set UserId(value) {
        this._UserId = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    set emailAddress(value) {
        this._emailAddress = value;
    }

    get address1() {
        return this._address1;
    }

    set address1(value) {
        this._address1 = value;
    }

    get address2() {
        return this._address2;
    }

    set address2(value) {
        this._address2 = value;
    }

    get city() {
        return this._city;
    }

    set city(value) {
        this._city = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get zipCode() {
        return this._zipCode;
    }

    set zipCode(value) {
        this._zipCode = value;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }
}

module.exports = User;