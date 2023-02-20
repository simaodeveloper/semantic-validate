import { fireEvent, screen } from '@testing-library/dom';
import { createValidation, schema } from '../../../lib';
import { formHTML } from '../../mocks';

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

    it.only('should display a message when rule required is invalid', () => {
        createValidation('#form', {
            schemas: {
                name: schema('text')
                    .required(),
            },
        });

        const form = screen.getByTestId('form');
        const name = screen.getByTestId('name') as HTMLInputElement;

        fireEvent.submit(form);

        expect(name).toBeInTheDocument();
        expect(name).toHaveAttribute('type', 'text');
        expect(name).toHaveAttribute('required');
        expect(screen.queryByText('The field is required!')).toBeInTheDocument();
        
        fireEvent.change(name, { target: { value: 'teste' } });
        fireEvent.submit(form);
        
        // console.log(document.body.innerHTML);

        // expect(screen.getByText('The field is required!')).not.toBeInTheDocument();

    });
});
