import "./index.scss";
import autosize from 'autosize';
import {
  MentionsInput,
  Mention,
  OnChangeHandlerFunc,
} from "react-mentions";
import EmojiPicker, { EmojiStyle, SkinTonePickerLocation, Theme } from 'emoji-picker-react';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "src/components/Icon";
import CharacterCount from './CharacterCount';
import classnames from 'classnames';
import useOutside from "src/utils/useOutside";

const LIMIT = 400;

const Form = (): JSX.Element => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef(null);
  const [count, setCount] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  useOutside(emojiRef, () => setOpen(false));

  useEffect(() => {
    const textarea = inputRef.current;
    autosize(textarea);

    return () => {
      autosize.destroy(textarea);
    };
  }, []);

  const defaultHashtags = useMemo(() => [
    ...message.split(' ').filter((word) => word.startsWith('#')),
    ...["#insta", "#tech", "#love"],
  ].map((word) => ({ id: word, display: word })), [message]);

  const handleChange = useCallback((event: { target: { value: string } }): OnChangeHandlerFunc => {
    const { value } = event.target;
    setMessage(value);
    setCount(value.length);
  }, []);

  const classNames = classnames('Form', {
    'Form--active': count > 0,
  });

  const handleInsert = useCallback((text: string) => {
    setMessage(`${message} ${text}`);
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [message]);

  return (
    <div className={classNames}>
      <fieldset>
        {/* input */}
        <MentionsInput
          className="Form__Input"
          inputRef={inputRef}
          value={message}
          required
          // maxLength={LIMIT}
          placeholder="I Wish There Was An App For ..."
          onChange={handleChange}>
          <Mention
            trigger="#"
            appendSpaceOnAdd
            data={defaultHashtags}
          />
        </MentionsInput>

        {/* actions */}
        <ul className="Form__Actions Form__Actions--left">
          <li className="Form__ActionsItem" ref={emojiRef}>
            <button onClick={() => setOpen(!isOpen)} title="Emoji">
              <Icon name="emoji" />
            </button>
            <EmojiPicker
              open={isOpen}
              theme={Theme.DARK}
              autoFocusSearch={false}
              lazyLoadEmojis={true}
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={(value) => handleInsert(value.emoji)}
              skinTonePickerLocation={SkinTonePickerLocation.PREVIEW} />
          </li>
          <li className="Form__ActionsItem">
            <button onClick={() => handleInsert("#")} title="Add a tag">
              <Icon name="hashtag" />
            </button>
          </li>
          {/* <li className="Form__ActionsItem">
            <button title="Poll"><Icon name="poll" /></button>
          </li> */}
        </ul>
        <div className="Form__Actions Form__Actions--right">
          <CharacterCount limit={LIMIT} count={count} />
          <button className="Form__Button">PUBLISH</button>
        </div>
      </fieldset>
    </div>
  )
}
export default Form
