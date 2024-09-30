export function RecoveryPhrase() {
    return (
        <>
            <h1 className="title justify-center align-content-center align-items-center flex">Save your passphrase</h1>
            <p className="text-justify">
                These words constitute your passphrase to recover your wallet in case you do not remember your password.
                Your password is secret and should never be transmitted to another user.

                Note these words carefully in a secure place.
            </p>

            <div className="flex items-center justify-between align-items-center justify-content-center flex-col mb-4">
                <div className="words-row">
                    <div className="word-group">
                        <label htmlFor=""></label>
                        <input type="text" className="word-input"/>
                    </div>
                    <div className="word-group">
                        <label htmlFor=""></label>
                        <input type="text" className="word-input"/>
                    </div>
                    <div className="word-group">
                        <label htmlFor=""></label>
                        <input type="text" className="word-input"/></div>
                </div>
                <div className="words-row">
                    <div className="word-group"><label htmlFor="">1</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">2</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">3</label><input type="text" className="word-input"/>
                    </div>
                </div>
                <div className="words-row">
                    <div className="word-group"><label htmlFor="">4</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">5</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">6</label><input type="text" className="word-input"/>
                    </div>
                </div>
                <div className="words-row">
                    <div className="word-group"><label htmlFor="">7</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">8</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">9</label><input type="text" className="word-input"/>
                    </div>
                </div>
                <div className="words-row">
                    <div className="word-group"><label htmlFor="">10</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">11</label><input type="text" className="word-input"/>
                    </div>
                    <div className="word-group"><label htmlFor="">12</label><input type="text" className="word-input"/>
                    </div>
                </div>
            </div>

            <button className="btn-primary btn-highlight">Continue</button>

        </>
    );
}