import { Component } from '../Component';
import { Monogatari } from '../monogatari';
import { Text } from '@aegis-framework/artemis';
import moment from 'moment';
import { $_ } from '@aegis-framework/artemis';

class Slot extends Component {

	static bind (selector) {

		Monogatari.registerListener ('delete-slot', {
			callback: () => {
				const target = Monogatari.global ('deleteSlot');

				// Delete the slot from the storage
				Monogatari.Storage.remove (target);

				// Remove the slot from both save and load screens
				this.instance (target).remove ();

				// Reset the temporal delete slot variable
				Monogatari.global ('deleteSlot', null);
				Monogatari.dismissAlertDialog ('slot-deletion');
			}
		});

		$_(`${selector}`).on ('click', '[data-component="slot"] [data-delete], [data-component="slot"] [data-delete] *', function (event) {
			Monogatari.debug ().debug ('Registered Click on Slot Delete Button');
			event.stopImmediatePropagation ();
			event.stopPropagation ();
			event.preventDefault ();

			let element = $_(this);
			if (element.matches ('path')) {
				element = element.closest ('[data-delete]');
			}

			Monogatari.global ('deleteSlot', element.data ('delete'));
			Monogatari.Storage.get (Monogatari.global ('deleteSlot')).then ((data) => {

				Monogatari.alert ('slot-deletion', {
					message: 'SlotDeletion',
					context: typeof data.name !== 'undefined' ? data.name : data.date,
					actions: [
						{
							label: 'Delete',
							listener: 'delete-slot'
						},
						{
							label: 'Cancel',
							listener: 'dismiss-alert'
						}
					]
				});
			});
		});
		return Promise.resolve ();
	}

	static render (slot, name, image, data) {
		return this.html (null, slot, name, image, data);
	}

}

Slot._id = 'data-slot';

Slot._html = (slot, name, image, data) => {
	let background = '';

	if (image) {
		background = `url(${Monogatari.setting ('AssetsPath').root}/${Monogatari.setting ('AssetsPath').scenes}/${image})`;
	} else if (data.game.state.scene) {
		background = data.game.state.scene;

		if (background.indexOf (' with ') > -1) {
			background = Text.suffix ('show scene', Text.prefix (' with ', background));
		}
	}

};

Monogatari.registerComponent (Slot);