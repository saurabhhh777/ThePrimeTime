import React, { useMemo } from 'react';
import Hnavbar from "../components/NavbarPage/Hnavbar";
import Vnavbar from "../components/NavbarPage/Vnavbar";
import {
	Download,
	Printer,
	CheckCircle2,
	XCircle,
	Calendar,
	Hash,
	Mail,
	Phone,
	MapPin
} from 'lucide-react';

interface InvoiceItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
}

const Invoice = () => {
	// Mock invoice data (can be wired to API later)
	const invoice = {
		number: 'INV-2024-0917',
		date: new Date(),
		status: 'Paid' as 'Paid' | 'Unpaid' | 'Overdue',
		company: {
			name: 'ThePrimeTime Inc.',
			email: 'billing@theprimetime.app',
			phone: '+1 (555) 010-3344',
			address: '221B Baker Street, Suite 42, London, UK'
		},
		customer: {
			name: 'Saurabh Sharma',
			email: 'saurabh@example.com',
			phone: '+91 98765 43210',
			address: 'DLF Phase 3, Gurugram, Haryana, IN'
		},
		currency: '₹',
		items: [
			{ id: '1', description: 'VS Code Activity Tracking – Pro Subscription (1 month)', quantity: 1, unitPrice: 499 },
			{ id: '2', description: 'Project Analytics & Reports add‑on', quantity: 1, unitPrice: 299 },
			{ id: '3', description: 'Priority Support', quantity: 1, unitPrice: 149 }
		] as InvoiceItem[],
		discount: 0,
		taxRate: 0.18, // 18%
		notes: 'Thank you for your business! Your subscription activates instantly.'
	};

	const { subTotal, taxAmount, total } = useMemo(() => {
		const sub = invoice.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
		const discounted = Math.max(0, sub - invoice.discount);
		const tax = +(discounted * invoice.taxRate).toFixed(2);
		const tot = +(discounted + tax).toFixed(2);
		return { subTotal: +sub.toFixed(2), taxAmount: tax, total: tot };
	}, [invoice.items, invoice.discount, invoice.taxRate]);

	const formatCurrency = (amount: number) => `${invoice.currency}${amount.toLocaleString()}`;

	const printInvoice = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-black font-['Poppins']">
			<Vnavbar className="fixed top-0 left-0 h-[calc(100vh-0.5rem)] mt-1 ml-1" />
			<div className="ml-[16.5rem] mr-1">
				<Hnavbar className="mt-1" />
				<main className="mt-1 ml-1 mr-1 p-6">
					{/* Header */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
						<div>
							<h1 className="text-4xl font-bold text-white">Invoice</h1>
							<p className="text-gray-400">Billing summary and payment receipt</p>
						</div>
						<div className="flex gap-3">
							<button
								onClick={printInvoice}
								className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
							>
								<Printer className="h-4 w-4" />
								Print / Save PDF
							</button>
							<button
								onClick={printInvoice}
								className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								Download
							</button>
						</div>
					</div>

					{/* Invoice Card */}
					<div id="invoice-card" className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
						{/* Top Bar */}
						<div className="flex flex-col lg:flex-row gap-6 p-6 border-b border-white/10">
							<div className="flex-1">
								<div className="flex items-center gap-2 text-gray-300 mb-1">
									<Hash className="h-4 w-4" />
									<span>Invoice No.</span>
								</div>
								<p className="text-white text-xl font-semibold">{invoice.number}</p>
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 text-gray-300 mb-1">
									<Calendar className="h-4 w-4" />
									<span>Date</span>
								</div>
								<p className="text-white text-xl font-semibold">
									{invoice.date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
								</p>
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 text-gray-300 mb-1">
									{invoice.status === 'Paid' ? (
										<CheckCircle2 className="h-4 w-4 text-green-400" />
									) : (
										<XCircle className="h-4 w-4 text-red-400" />
									)}
									<span>Status</span>
								</div>
								<p className={`text-xl font-semibold ${invoice.status === 'Paid' ? 'text-green-400' : 'text-red-400'}`}>{invoice.status}</p>
							</div>
						</div>

						{/* Parties */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-white/10">
							<div className="bg-white/5 rounded-xl p-4 border border-white/10">
								<h3 className="text-white font-semibold mb-3">Billed From</h3>
								<p className="text-white text-lg">{invoice.company.name}</p>
								<div className="mt-2 space-y-1 text-gray-300">
									<p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {invoice.company.email}</p>
									<p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {invoice.company.phone}</p>
									<p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {invoice.company.address}</p>
								</div>
							</div>
							<div className="bg-white/5 rounded-xl p-4 border border-white/10">
								<h3 className="text-white font-semibold mb-3">Billed To</h3>
								<p className="text-white text-lg">{invoice.customer.name}</p>
								<div className="mt-2 space-y-1 text-gray-300">
									<p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {invoice.customer.email}</p>
									<p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {invoice.customer.phone}</p>
									<p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {invoice.customer.address}</p>
								</div>
							</div>
						</div>

						{/* Items */}
						<div className="p-6">
							<div className="overflow-x-auto rounded-xl border border-white/10">
								<table className="w-full">
									<thead className="bg-white/5">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Description</th>
											<th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Qty</th>
											<th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Unit Price</th>
											<th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Amount</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-white/10">
										{invoice.items.map(item => (
											<tr key={item.id} className="hover:bg-white/5 transition-colors">
												<td className="px-4 py-3 text-white">{item.description}</td>
												<td className="px-4 py-3 text-right text-white">{item.quantity}</td>
												<td className="px-4 py-3 text-right text-white">{formatCurrency(item.unitPrice)}</td>
												<td className="px-4 py-3 text-right text-white">{formatCurrency(item.quantity * item.unitPrice)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Totals */}
							<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="bg-white/5 rounded-xl p-4 border border-white/10">
									<h4 className="text-white font-semibold mb-2">Notes</h4>
									<p className="text-gray-300 text-sm leading-relaxed">{invoice.notes}</p>
								</div>
								<div className="bg-white/5 rounded-xl p-4 border border-white/10">
									<div className="space-y-2">
										<div className="flex items-center justify-between text-gray-300">
											<span>Subtotal</span>
											<span className="text-white">{formatCurrency(subTotal)}</span>
										</div>
										<div className="flex items-center justify-between text-gray-300">
											<span>Discount</span>
											<span className="text-white">{formatCurrency(invoice.discount)}</span>
										</div>
										<div className="flex items-center justify-between text-gray-300">
											<span>Tax ({Math.round(invoice.taxRate * 100)}%)</span>
											<span className="text-white">{formatCurrency(taxAmount)}</span>
										</div>
										<div className="flex items-center justify-between text-white text-lg font-semibold pt-2 border-t border-white/10">
											<span>Total</span>
											<span>{formatCurrency(total)}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Invoice;