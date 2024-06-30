import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

EmbedHtml.propTypes = {
  iframe: PropTypes.string,
  videoIframe: PropTypes.string,
};
function EmbedHtml({iframe, videoIframe, ...props}) {
  const sanitizedHtmlString = DOMPurify.sanitize(iframe || videoIframe, {
    ALLOWED_TAGS: ['iframe'],
    ALLOWED_ATTR: [
      'width',
      'height',
      'src',
      'title',
      'frameborder',
      'allow',
      'allowfullscreen',
      'referrerpolicy',
      'loading',
    ],
  });

  return <div dangerouslySetInnerHTML={{__html: sanitizedHtmlString}} />;
}

export default EmbedHtml;
