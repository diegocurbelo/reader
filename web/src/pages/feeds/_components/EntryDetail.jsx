import React from 'react'
import moment from 'moment';
import Media from 'react-bootstrap/lib/Media'
import './EntryDetail.css'

const EntryDetail = ({ entry }) => (
  <Media className={`card EntryDetail ${entry.read ? 'read' : 'unread'}`}>
    <Media.Body>
      <Media.Heading>
        <a target="_blank" href={entry.url} rel="noopener noreferrer" dangerouslySetInnerHTML={{__html: entry.title}} />
        <p>Published {moment.utc(entry.published_at).fromNow()}</p>
      </Media.Heading>
      <div className="media-content" dangerouslySetInnerHTML={{__html: entry.content}} />
    </Media.Body>
</Media>
)

export default EntryDetail;