import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';

function CreateArea(props) {
	const [ noteItem, setNoteItem ] = useState({
		title: '',
		content: ''
	});
	const [ hide, setHide ] = useState(true);

	function handleChange(event) {
		const { name, value } = event.target;
		setNoteItem((prevValue) => {
			return { ...prevValue, [name]: value }; // substitute object key as variable
		});
	}

	return (
		<div>
			<form className="create-note">
				<input
					name="title"
					placeholder="Title"
					type={hide ? 'hidden' : null}
					onChange={handleChange}
					value={noteItem.title}
				/>
				<textarea
					name="content"
					placeholder="Take a note..."
					rows={hide ? '1' : '3'}
					onChange={handleChange}
					onClick={() => {
						setHide(false);
					}}
					value={noteItem.content}
				/>
				<Zoom in={!hide}>
					<Fab
						onClick={(event) => {
							props.onAdd(noteItem);
							setNoteItem({
								title: '',
								content: ''
							});
							event.preventDefault();
						}}
					>
						<AddIcon />
					</Fab>
				</Zoom>
			</form>
		</div>
	);
}

export default CreateArea;
