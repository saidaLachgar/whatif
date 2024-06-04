import "./index.scss";
import autosize from 'autosize';
import {
  MentionsInput,
  Mention,
  OnChangeHandlerFunc,
} from "react-mentions";
import EmojiPicker, { EmojiStyle, SkinTonePickerLocation, Theme } from 'emoji-picker-react';
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "src/components/Icon";
import CharacterCount from './CharacterCount';
import classnames from 'classnames';
import useOutside from "src/utils/useOutside";
import { useMutation, useQueryClient } from "react-query";
import api from 'src/api/posts';
import toast from "react-hot-toast";
import { TPostHashtags } from "src/model/post";

const LIMIT = 400;

const Form = (): JSX.Element => {
  const ipAddress: string | null = window.localStorage.getItem('ipAddress');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef(null);
  const [count, setCount] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [content, setContent] = useState("");
  useOutside(emojiRef, () => setOpen(false));
  const queryClient = useQueryClient();

  const mutation = useMutation(api.addPost, {
    onMutate: () => {
      toast.loading('Submitting post...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Post submitted successfully', { icon: '🔥' });
      queryClient.invalidateQueries('posts');
      setContent('');
      setCount(0);
    },
    onError: (error) => {
      toast.dismiss();
      // @ts-ignore 
      toast.error(`Error submitting post: ${error.message}`);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!content || count > LIMIT) {
      return;
    }

    const ipAddress = window.localStorage.getItem('ipAddress')!;
    const transformMarkup = content.match(/#\[([^#\]]+)\]/)?.[1] || content;
    mutation.mutate({
      // content: '',
      content: transformMarkup.replace(/(?:\r\n|\r|\n)/g, '<br>'),
      ipAddress,
    });
  }, [content, mutation, count]);

  useEffect(() => {
    const textarea = inputRef.current;
    autosize(textarea);

    return () => {
      autosize.destroy(textarea);
    };
  }, []);

  const hashtagsSuggestions = async (query: string, callback) => {
    try {
      const response: TPostHashtags[] = await (
        query ? api.fetchHashtags(query) : api.topHashtags({
          queryKey: [
            // @ts-ignore
            'hashtagsSuggestions', { ipAddress: ipAddress as string }
          ]
        })
      );

      const suggestions = response.slice(0, 5).map((hashtag) => ({
        id: hashtag._id,
        display: `${hashtag._id} (${hashtag.count} posts)`,
      }));
      callback(suggestions);

    } catch (error) {
      console.error('Error fetching hashtag suggestions:', error);
    }

  };

  const handleChange = useCallback((event: { target: { value: string } }): OnChangeHandlerFunc => {
    const { value } = event.target;
    setContent(value);
    setCount(value.length);
    setTimeout(() => {
      if (inputRef?.current?.style.height === '72px') {
        inputRef.current.style.height = `${inputRef.current.scrollHeight + 20}px`;
      }
    }, 100);
  }, []);

  const classNames = classnames('Form', {
    'Form--active': count > 0,
  });

  const handleInsert = useCallback((text: string) => {
    setContent(`${content} ${text}`);
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [content]);

  return (
    <div className={classNames}>
      <fieldset>
        {/* input */}
        <MentionsInput
          className="Form__Input"
          inputRef={inputRef}
          value={content}
          required
          placeholder="I Wish There Was An App For ..."
          onChange={handleChange}>
          <Mention
            trigger="#"
            appendSpaceOnAdd
            displayTransform={(id: string) => id}
            markup="#[__id__]"
            data={hashtagsSuggestions}
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
          <button
            disabled={count > LIMIT}
            onClick={handleSubmit}
            className="Form__Button"
          >PUBLISH</button>
        </div>
      </fieldset>
    </div>
  )
}
export default Form
