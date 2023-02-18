import { fireEvent, screen } from '@testing-library/dom';
import { createValidation, schema } from '../../../lib';

const formHTML = `
    <form id="form" data-testid="form">
        <div>
            <label for="name">Name</label>
            <input name="name" id="name" data-testid="name"/>
        </div>
        <div>
            <label for="email">Email</label>
            <input name="email" id="email" />
        </div>
        <div>
            <label for="url">URL</label>
            <input name="url" />
        </div>
        <div>
            <label for="sex_female">
                <input name="sex" id="sex_female" value="female"> Female
            </label>
            <label for="sex_male">
                <input name="sex" id="sex_male" value="male"> Male
            </label>
        </div>
        <div>
            <label for="fruits">Fruits</label>
            <select name="fruits" id="fruits">
                <option value="apple">Apple</option>
                <option value="banana">Banana</option>
                <option value="grape">Grape</option>
            </select>
        </div>
        <div>
            <label for="pets">Pets</label>
            <select name="pets" id="pets">
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
            </select>
        </div>
        <div>
            <label for="description">Description</label>
            <textarea name="description" id="description"></textarea>
        </div>
        <div>
            <button type="submit">Submit</button>
        </div>
    </form>
`;

describe('SemanticValidate class', () => {
    beforeEach(() => {
        document.body.innerHTML = formHTML;
    });

    it('should have the form element in the document', () => {
        const form = screen.getByTestId('form');
        expect(form).toBeInTheDocument();
        expect(form instanceof HTMLFormElement).toBeTruthy();
    });

    it('should set all field types correctly', () => {
        createValidation('#form', {
            schemas: {
                name: schema('text'),
            },
        });

        const form = screen.getByTestId('form');
        const name = screen.getByTestId('name');

        fireEvent.submit(form);

        expect(name).toBeInTheDocument();
        expect(name).toHaveAttribute('type', 'text');
    });
});
